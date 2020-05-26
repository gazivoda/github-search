import gql from 'graphql-tag';
import React, { Component } from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import Search from '../search/index';
import _ from 'lodash';

type UserProfile = {
  id: string
  name: string
  email: string
  url: string
  avatarUrl: string
  repositories: Repository[]
}

type Repository = {
  id: string
  name: string
  url: string
}

type UserData = {
  user: UserProfile[];
}

const REPOSITORY_ATTRIBUTES = gql`
fragment RepositoryAttributes on Repository { 
    id
    name
    url
}
`;

const USER_ATTRIBUTES = gql`
fragment UserAttributes on User { 
    id
    name
    email
    url
    avatarUrl
    repositories(first: 20){
      edges{
        node{
          ...RepositoryAttributes
        }
      }
    }
  }
  ${REPOSITORY_ATTRIBUTES}
`;

const GET_CURRENT_USER = gql`
query searchUsers($searchText: String!){
    search(query: $searchText, type: USER, first: 20) {
      userCount
      edges {
        node {
          ... UserAttributes
      }
    }
  }
}
${USER_ATTRIBUTES}
`;

type GithubSearchContainerProps = WithApolloClient<GithubSearchContainer>;
type MyState = { searchText: string, result: UserData, selectedProfile: UserProfile, loading: boolean };

class GithubSearchContainer extends Component<GithubSearchContainerProps, MyState>  {
  constructor(props: GithubSearchContainerProps) {
    super(props);
    this.state = {
      searchText: '',
      result: null,
      selectedProfile: null,
      loading: false
    }
  }

  search = async () => {
    const { searchText } = this.state;
    const result = await this.props.client.query({
      query: GET_CURRENT_USER,
      variables: { searchText }
    });

    let resultData: UserData = result.data.search.edges.map(userItem => {
      userItem.node.repositories = userItem?.node?.repositories?.edges?.map(repoItem => {
        delete repoItem.node.__typename;
        return repoItem.node
      });
      delete userItem.node.__typename;
      return userItem.node;
    });

    this.setState({ result: resultData, loading: false });
  }

  executeSearch = _.debounce(this.search, 300);

  handleTextChange = (e) => {
    this.setState({ searchText: e.target.value, loading: true })
    this.executeSearch();
  }

  render() {
    return (
      <div>
        <Search onChange={this.handleTextChange} loading={this.state.loading} />
        {this.state.searchText}
        <div>
          {JSON.stringify(this.state.result)}
        </div>
      </div>
    );
  }
}

export default withApollo(GithubSearchContainer);

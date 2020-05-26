import gql from 'graphql-tag';
import React, { Component } from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import Search from '../search/index';
import _ from 'lodash';

const REPOSITORY_ATTRIBUTES = gql`
fragment RepositoryAttributes on Repository { 
    name
    url
}
`;

const USER_ATTRIBUTES = gql`
fragment UserAttributes on User { 
    name
    email
    url
    updatedAt
    repositories(first: 10){
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
    search(query: $searchText, type: USER, first: 10) {
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
type MyState = { searchText: string, result: {}, selectedProfile: any, loading: boolean };

class GithubSearchContainer extends Component<GithubSearchContainerProps, MyState>  {
  constructor(props: GithubSearchContainerProps) {
    super(props);
    this.state = {
      searchText: '',
      result: {},
      selectedProfile: {},
      loading: false
    }
  }

  search = async () => {
    const { searchText } = this.state;
    const result = await this.props.client.query({
      query: GET_CURRENT_USER,
      variables: { searchText }
    });
    this.setState({ result: result.data, loading: false });
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

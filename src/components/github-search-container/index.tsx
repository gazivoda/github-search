import gql from 'graphql-tag';
import React, { Component } from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import Search from '../search/index';

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
type MyState = { searchText: string, result: {} };

class GithubSearchContainer extends Component<GithubSearchContainerProps, MyState>  {
  constructor(props: GithubSearchContainerProps) {
    super(props);
  }

  state = {
    searchText: '',
    result: {},
    selectedProfile: {}
  }

  _executeSearch = async () => {
    const { searchText } = this.state;
    const result = await this.props.client.query({
      query: GET_CURRENT_USER,
      variables: { searchText }
    });

    this.setState({ result: result.data });
  }

  handleTextChange = (e) => {
    this.setState({ searchText: e.target.value })
  }

  render() {
    return (
      <div>
        <Search onChange={this.handleTextChange} />
        {this.state.searchText}
        <button
          onClick={() => this._executeSearch()}
        >button</button>
        <div>
          {JSON.stringify(this.state.result)}
        </div>
      </div>
    );
  }
}

export default withApollo(GithubSearchContainer);

import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Query, useQuery, withApollo, WithApolloClient } from 'react-apollo';

const GET_CURRENT_USER = gql`
query searchUsers($searchText: String!){
    search(query: $searchText, type: USER, first: 10) {
      userCount
      edges {
        node {
          ... on User {
            name
                 email
            url
            updatedAt
          }
        }
      }
    }
  }
`;

type GithubSearchProps = WithApolloClient<GithubSearch>;
type MyState = { searchText: string, result: {} };

class GithubSearch extends Component<GithubSearchProps, MyState>  {
    constructor(props: GithubSearchProps) {
        super(props);
    }

    state = {
        searchText: '',
        result: {}
    }

    _executeSearch = async () => {
        const { searchText } = this.state;
        const result = await this.props.client.query({
            query: GET_CURRENT_USER,
            variables: { searchText }
        });
        this.setState({ result: result.data });
    }

    render() {
        return (
            <div>
                <input
                    type='text'
                    onChange={(e) => this.setState({ searchText: e.target.value })}
                />
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

export default withApollo(GithubSearch);

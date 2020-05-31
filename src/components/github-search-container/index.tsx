import gql from 'graphql-tag';
import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import Profile from '../profile';
import Search from '../search/index';
import RepositoriesModal from '../repositories-modal';
import RepositoriesTable from '../repositories-table';

export type UserProfile = {
  id: string,
  login: string,
  name: string,
  email: string,
  url: string,
  avatarUrl: string,
  repositories: Repository[],
  open: boolean
};

export type Repository = {
  id: string,
  name: string,
  description: string,
  url: string,
};

const REPOSITORY_ATTRIBUTES = gql`
fragment RepositoryAttributes on Repository { 
    id
    name
    description
    url
}
`;

const USER_ATTRIBUTES = gql`
fragment UserAttributes on User { 
    id
    name
    login
    email
    url
    avatarUrl
    repositories(ownerAffiliations:[OWNER], first: 20){
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
    search(query: $searchText, type: USER, first: 21) {
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
type MyState = { searchText: string, results: UserProfile[], selectedProfile: UserProfile, loading: boolean };

class GithubSearchContainer extends Component<GithubSearchContainerProps, MyState>  {
  constructor(props: GithubSearchContainerProps) {
    super(props);
    this.state = {
      searchText: '',
      results: [],
      selectedProfile: null,
      loading: false
    }
  }

  search = async () => {
    const { searchText } = this.state;

    const results = await this.props.client.query({
      query: GET_CURRENT_USER,
      variables: { searchText }
    });

    this.setState({ results: this.state.loading ? this.transformResults(results) : this.state.results, loading: false });
  }

  transformResults = (results): UserProfile[] => {
    return results.data.search.edges.map(userItem => {
      userItem.node.repositories = userItem?.node?.repositories?.edges?.map(repoItem => {
        delete repoItem.node.__typename;
        return repoItem.node
      });
      delete userItem.node.__typename;
      userItem.node.open = false;
      return userItem.node;
    });
  }

  executeSearch = _.debounce(this.search, 300);

  handleTextChange = (e) => {
    const searchValue = !!e ? e.target.value : '';
    if (searchValue === '') {
      // * Handle empty input case
      this.setState({ searchText: searchValue, loading: false, results: [] });
    } else {
      // * Grapql query execution if input is not empty
      this.setState({ searchText: searchValue, loading: true })
      this.executeSearch();
    }
  }

  handleOpenChange(result: UserProfile, value: boolean) {
    this.setState((state: MyState) => {
      const stateCopy = JSON.parse(JSON.stringify(state));
      stateCopy.results.find(item => item.id === result.id).open = value;
      return { ...stateCopy };
    });
  };

  render() {
    return (
      <Fragment>
        <h1 style={{ color: '#e6c8b5', textAlign: 'center' }}>Search Github users by their username...</h1>
        <Search onChange={this.handleTextChange} loading={this.state.loading} />
        <div className='profiles-container'>
          {this.state.results.map((result: UserProfile) =>
            <Profile key={result.id} {...result} onClick={() => !!result.repositories && !!result.repositories.length && this.handleOpenChange(result, true)} >
              <RepositoriesModal title={result.name} open={result.open || false} onClose={() => this.handleOpenChange(result, false)}>
                <RepositoriesTable data={result.repositories}></RepositoriesTable>
              </RepositoriesModal>
            </Profile>
          )}
        </div>
      </Fragment >
    );
  }
}

export default withApollo(GithubSearchContainer);

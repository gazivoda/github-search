import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import App from './App';

const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' });

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${process.env.GIT_TOKEN}`
        }
    };
});

const link = authLink.concat(httpLink);

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { store, client } from './state';
import App from './App';

render(
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app'),
);

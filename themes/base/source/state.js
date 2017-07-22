import { createStore, combineReducers, applyMiddleware } from 'redux';
import { ApolloClient, createNetworkInterface } from 'apollo-client';

const initialState = {
  showInfo: false,
  currentItemID: 0,
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        ...state,
        showInfo: !state.showInfo,
      };
    case 'SELECT':
      return {
        ...state,
        currentItemID: action.payload,
      };
    default:
      return state;
  }
};

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
});

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.ID,
});

const reducer = combineReducers({
  main: mainReducer,
  apollo: client.reducer(),
});

const createStoreWithMiddleware = applyMiddleware(client.middleware())(createStore);
/* eslint-disable no-underscore-dangle */
const store = createStoreWithMiddleware(
  reducer,
);

export {
  store,
  client,
};

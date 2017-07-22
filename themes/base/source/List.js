import React from 'react';
import ggl from 'graphql-tag';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

const QUERY = ggl`
query ReadItems($limit: Int, $offset: Int) {
  readItems(limit: $limit, offset: $offset) {
    edges {
      node {
        __typename
        ID
        Title
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}`;


const List = ({ items, selectItem, hasMore, loadMore }) => (
  <ul>
    {items.map(item => (
      <li key={item.ID}>
        <a
          href="#"
          role="presentation"
          onClick={(e) => {
            e.preventDefault();
            selectItem(item.ID);
          }}
        >
          {item.Title}
        </a>
      </li>
    ))}
    {hasMore &&
    <li><a role="presentation" onClick={loadMore}>load more</a></li>
    }
  </ul>
);

const ListWithData = graphql(QUERY, {
  props({ data: { loading, readItems, fetchMore } }) {
    return {
      loading,
      items: !readItems ? [] : readItems.edges.map(e => e.node),
      hasMore: readItems ? readItems.pageInfo.hasNextPage : false,
      loadMore() {
        return fetchMore({
          variables: {
            offset: readItems.edges.length,
          },
          updateQuery(previousResult, { fetchMoreResult }) {
            if (!fetchMoreResult) return previousResult;

            const newEdges = fetchMoreResult.readItems.edges;
            const pageInfo = fetchMoreResult.readItems.pageInfo;

            return {
              ...previousResult,
              readItems: {
                edges: [
                  ...previousResult.readItems.edges,
                  ...newEdges,
                ],
                pageInfo,
              },
            };
          },
        });
      },
    };
  },

  options() {
    return {
      variables: {
        offset: 0,
        limit: 10,
      },
    };
  },
})(List);

const ListWithDataAndState = connect(
  state => ({
    currentItemID: state.main.currentItemID,
  }),
  dispatch => ({
    selectItem(id) {
      dispatch({ type: 'SELECT', payload: id });
    },
  }),
)(ListWithData);

export default ListWithDataAndState;

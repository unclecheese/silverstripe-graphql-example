import React from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import ggl from 'graphql-tag';

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

const Info = ({ allItemsInList, currentItemID, nextItem }) => {
  const info = [
    <p key={1}>{allItemsInList.length} items in the list</p>,
    <p key={2}>Selected itemID is {currentItemID}</p>,
  ];
  if (nextItem) {
    info.push(<p key={3}>Next item is {nextItem.Title}</p>);
  }
  return (
    <div>{info}</div>
  );
};

const InfoWithNextItem = graphql(QUERY, {
  props({ data: { readItems } }) {
    return {
      nextItem: readItems ? readItems.edges[0].node : null,
    };
  },
  options() {
    return {
      variables: {
        offset: 0, // should be List.items.length +1,
        limit: 1,
      },
    };
  },
})(Info);

const InfoWithNextItemAndState = connect(
  state => ({
    currentItemID: state.main.currentItemID,
    allItemsInList: [], // No idea how to get this
  }),
)(InfoWithNextItem);

export default InfoWithNextItemAndState;

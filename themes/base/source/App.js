import React from 'react';
import { connect } from 'react-redux';
import Info from './Info';
import List from './List';

const App = ({ showInfo, toggle }) => (
  <div>
    <h2><button role="presentation" onClick={toggle}>show info</button></h2>
    {showInfo && <Info />}
    <List />
  </div>
);
export default connect(
  state => ({
    showInfo: state.main.showInfo,
  }),
  dispatch => ({
    toggle() {
      dispatch({ type: 'TOGGLE' });
    },
  }),
)(App);

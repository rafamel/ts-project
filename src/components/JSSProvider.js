import React from 'react';
import PropTypes from 'prop-types';
import { jssPreset } from '@material-ui/styles';
import Provider from 'react-jss/lib/JssProvider'; // TODO: change once fixed on MUI; npm remove react-jss
import { create } from 'jss';

const drop = document.createElement('noscript');
drop.id = 'jss-drop';
document.head.insertBefore(drop, document.head.firstChild);

const jss = create({
  ...jssPreset(),
  insertionPoint: drop
});

// Forces injection order: JSS first.
const JssProvider = ({ children }) => <Provider jss={jss}>{children}</Provider>;
JssProvider.propTypes = {
  children: PropTypes.node
};

export default JssProvider;

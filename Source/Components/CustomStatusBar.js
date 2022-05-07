import * as React from 'react';
import { StatusBar } from 'react-native';

const CustomStatusBar = (props) => {
  return (
    <StatusBar
      backgroundColor={props.backgroundColor}
      barStyle="light-content"
    />
  );
};

export default CustomStatusBar;

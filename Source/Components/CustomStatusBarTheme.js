import * as React from 'react';
import { MyColors } from '../Theme';
import { Component } from 'react';
import CustomStatusBar from './CustomStatusBar';

export default class CustomStatusBarTheme extends Component {
  render() {
    return <CustomStatusBar backgroundColor={MyColors.themeColor} />;
  }
}

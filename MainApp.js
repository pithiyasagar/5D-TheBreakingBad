import * as React from 'react'
import {
  Image,
  View,
} from 'react-native'

// 3rd Party
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import { MyColors } from './Source/Theme'
// import string from './Source/Localization/string';

import HomeScreen from "./Source/Screens/HomeScreen";
import DetailScreen from "./Source/Screens/DetailScreen";


const StackMain = createStackNavigator()


class MainApp extends React.Component {

  constructor() {
    super()
    console.disableYellowBox = true;
  }

  render() {
    return (
        <View style={{ flex: 1, }}>
          <NavigationContainer>
            {this.renderVerifyStack()}
          </NavigationContainer>
        </View>
    )
  }

  renderVerifyStack = () => {
    return (
      <StackMain.Navigator
        screenOptions={MainApp.customizeNavigationBarWithGrayColor()}
      // initialRouteName='HomeScreen'
      >
          <StackMain.Screen
            name='HomeScreen'
            component={HomeScreen}
          />
          <StackMain.Screen
            name='DetailScreen'
            component={DetailScreen}
          />
      </StackMain.Navigator>
    )
  }

  // Navigation bar customization
  static customizeNavigationBarWithGrayColor(title) {
    return MainApp.customizeNavigationBarWithHeaderStyle(
      MainApp.setNavigationBarBackgroundColorLightGray(),
      title == null ? "" : title
    )
  }

  static customizeNavigationBarWithWhiteColor(title) {
    return MainApp.customizeNavigationBarWithHeaderStyle(
      MainApp.setNavigationBarBackgroundColorWhite(),
      title == null ? "" : title
    )
  }

  static customizeNavigationBarWithHeaderStyle(headerStyle, navTitle) {
    return {
      title: navTitle,
      headerTintColor: MyColors.whiteColor,
      headerBackTitleVisible: false,
      // headerBackImage: MyCustomHeaderBackImage,
      headerTitleStyle: {
        fontSize: 17,
        fontWeight: null,
        letterSpacing: 0.3
      },
      // headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: MyColors.themeColor,
        shadowColor: 'transparent',
        elevation: 0,
      }
    }
  }
  static setNavigationBarBackgroundColorLightGray() {
    return this.setNavigationBarBackgroundColor(MyColors.greenDark)
  }
  static setNavigationBarBackgroundColorWhite() {
    return this.setNavigationBarBackgroundColor(MyColors.offWhiteColor)
  }
  static setNavigationBarBackgroundColor(color) {
    return {
      backgroundColor: MyColors.themeColor,
      shadowColor: 'transparent',
      elevation: 0,
    }
  }
}

export default MainApp


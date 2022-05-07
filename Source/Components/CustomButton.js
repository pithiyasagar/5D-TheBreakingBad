import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MyColors } from '../Theme';

const CustomButton = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styleButton(props)}
      onPress={props.onPress}
      disabled={enableDisablebutton(props)}>
      {props.isLoading ? <ActivityIndicator color="white" /> : <Text style={styleTitle(props)} >{props.title}</Text>}
    </TouchableOpacity>
  );
};

function enableDisablebutton(props) {
  return props.disabled === true ? true : false;
}

function styleTitle(props) {
  const style = StyleSheet.create({
    default: {
      fontSize: 18,
      fontFamily: 'Epilogue-Bold',
      letterSpacing: -0.4,
      color: props.textColor != undefined ? props.textColor : MyColors.whiteColor,
    },
    custom: props.titleCustomStyle,
  });
  return [style.default, style.custom];
}

function styleButton(props) {
  const style = StyleSheet.create({
    default: {
      height: 44,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: MyColors.themeColor,
    },
    custom: props.buttonCustomStyle,
  });
  return [style.default, style.custom];
}

export default CustomButton;

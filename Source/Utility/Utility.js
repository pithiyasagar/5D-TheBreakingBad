
import { Alert, Dimensions } from "react-native";
import moment from "moment"; // for date format
import Toast from 'react-native-simple-toast';

const APP_NAME = "TheBreakingBad"

export const showMessageAlert = message => {

  Toast.showWithGravity(message.toString(), Toast.SHORT, Toast.BOTTOM)

  // Alert.alert(
  //   APP_NAME,
  //   message,
  //   [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //   { cancelable: false }
  // );
};

export const showNativeMessageAlert = message => {

  Alert.alert(
    APP_NAME,
    message,
    [{ text: "Okay", onPress: () => console.log("OK Pressed") }],
    { cancelable: false }
  );
};

export const insertNewObjectInArrayAtIndex = (array, index, newItem) => {
  return [
      ...array.slice(0, index),
      newItem,
      ...array.slice(index)
  ];
}

export const convertUTCDateToLocalDate = dateString => {
  console.log("dateString is >>> ", dateString);

  var localDate = new Date(dateString);
  return localDate
};

export const parseUTCDate = dateString => {
  console.log("dateString is >>>> ", dateString);

  const dateParams = dateString.replace(/ UTC/, "").split(/[\s-:]/);
  dateParams[1] = (parseInt(dateParams[1], 10) - 1).toString();

  return new Date(Date.UTC(...dateParams));
};

export const printOnConsole = text => {
  console.log(text);
}

export const showServerMessageAlert = response => {
  // console.log("showServerMessageAlert ", response);
  // const json = JSON.parse(response);
  // console.log("showServerMessageAlert json", json);

  Alert.alert(
    APP_NAME,
    response,
    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
    { cancelable: false }
  );
};

export const isEmpty = value => {
  if (value == null) {
    return true
  }
  value = value.trim()
  if (value == null || value == undefined) {
    return true;
  } else if (value == "") {
    return true;
  }
  return false;
};

export const isValidEmail = value => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(value) === false) {
    //console.log("Email is Not Correct");
    return false;
  } else {
    //console.log("Email is Correct");
    return true;
  }
};

export const getHexStringFromTimestamp = () => {
  var timestamp = new Date().getTime()
  hexString = number.toString(16);
  return hexString;
};

export const formatDate = (date, format) => {
  console.log("format - ", format);
  return moment(date).format(format);
};

export const isiPhoneX = () => {
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width
  if (Platform.OS === 'android') {
    return false
  } else {

    // iPhone X height/width is 812
    // iPhone XR, XS, & XS Max height/width is 896

    if (height == 812 || width == 812 || height == 896 || width == 896) {
      return true
    } else {
      return false
    }
  }
}

export const camelText = value => {
  // value = value.length ? value.charAt(0).toLowerCase() + value.slice(1) : value
  value = value?.split(' ')
  .map((word, index) => {
    // First character upper case else lower case
    return word.charAt(0)
    .toUpperCase() + word.slice(1)
    .toLowerCase()
  }).join(' ')
  return value;
};
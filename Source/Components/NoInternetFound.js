import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

// import global_images from '@assets/images';
import strings from '../Localization/strings';
import CustomButton from './CustomButton';

export default class NoInternetFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {textColor = '#324755'} = this.props;

    return (
      <View style={{flex: 1, margin: 20}}>
        <View style={Styles.vwMainContainer}>
          {/* <Image source={global_images.no_internet} /> */}
          <Text
            style={{
              marginTop: 20,
              fontSize: 18,
              color: textColor,
            }}></Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 14,
              // marginTop: 20,
              color: textColor,
            }}>
            {strings.no_internet_connection_msg}
          </Text>

          <CustomButton
            buttonCustomStyle={{width: '70%', marginTop: 30}}
            title={strings.retry}
            onPress={this.props.onPress}
          />
        </View>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  vwMainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

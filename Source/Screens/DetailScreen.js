import React from 'react'
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  DeviceEventEmitter
} from 'react-native'
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'

import {MyColors} from '../Theme';
import strings from '../Localization/strings';
import CustomStatusBarTheme from '../Components/CustomStatusBarTheme'
import { ScrollView } from 'react-native-gesture-handler';
import { isEmpty } from '../Utility/Utility'


export default class DetailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      detailObj: {},
    }
  }

  componentDidMount() {
    this.props.navigation.setOptions({ headerShown: false })

    if (this.props.route.params != null && this.props.route.params != undefined) {
      this.setState({ detailObj: this.props.route.params.detailObj })
    }
  }

  render() {
    var detailObj = this.state.detailObj

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: MyColors.blackColor }}>
        <CustomStatusBarTheme />
        <ScrollView>
          <View style={{ alignItems: 'flex-start' }} >
            <ImageBackground style={{ height: 370, width: '100%', alignItems :'center' }}
              source={{uri: detailObj.img}}>
              <LinearGradient colors={['#FFFFFF00', 'black']}
                style={{ height: '100%', width: '100%', alignItems :'center' }}>
                <FastImage style={Styles.centerImage} source={{uri: detailObj.img}} />
                <Text style={Styles.nameText}>{detailObj.name}</Text>
                <Text style={Styles.nicknameText}>{detailObj.nickname}</Text>
                <Text style={Styles.statusText}>{detailObj.status}</Text>
              </LinearGradient>
            </ImageBackground>
            <View style={{ flexDirection: 'row', marginHorizontal: 20, alignItems : 'center' }}>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text style={Styles.potrayedText}>{strings.potrayed}</Text>
                <Text style={[Styles.dobText, { marginTop: 5 }]}>{detailObj.portrayed}</Text>
              </View>
              {isEmpty(detailObj.birthday) || detailObj.birthday == 'Unknown' ? null :
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <Text style={Styles.dobText}>{moment(detailObj.birthday, 'MM-DD-YYYY').format('DD-MMM-YYYY')}</Text>
                  <Icon name="gift" size={20} color="#FFF" style={{ marginStart: 10 }} />
                </View>
              }
            </View>
            <Text style={[Styles.potrayedText, { marginTop: 30, marginHorizontal: 20 }]}>{strings.occupation}</Text>
            <FlatList
              style={{ marginTop: 5 }}
              data={detailObj.occupation}
              renderItem={this.renderOccupationItem}
              showsVerticalScrollIndicator={false}

              keyExtractor={item => item + ''}
            />
            <Text style={[Styles.potrayedText, { marginTop: 30, marginHorizontal: 20 }]}>{strings.appeared_in}</Text>
            <FlatList
              horizontal
              style={{ marginTop: 15, marginHorizontal: 15 }}
              data={detailObj.appearance}
              renderItem={this.renderAppearedItem}
              showsHorizontalScrollIndicator={false}

              keyExtractor={item => item + ''}
            />
          </View>
        </ScrollView>

        {this.renderBack()}
        {this.renderHeart()}

      </SafeAreaView>
    )
  }

  renderBack = () => {
    return (
      <TouchableOpacity
        style={{ position: 'absolute' }}
        onPress={() => { this.props.navigation.goBack() }}>
        <Icon name="arrow-left" size={30} color="#FFF" style={{ padding: 10 }} />
      </TouchableOpacity>
    )
  }

  renderHeart = () => {
    return (
      <TouchableOpacity
        style={{ right: 0, position: 'absolute' }}
        onPress={() => { this.onFavorite()  }}>
        <Icon name={this.state.detailObj.isFavorite ? 'heart' : 'heart-o'} 
        size={25} color='green' style={{ padding: 10 }} />
      </TouchableOpacity>
    )
  }

  onFavorite() {
    var detailObj = this.state.detailObj
    var isFavorite = false
    if (detailObj.isFavorite == undefined || detailObj.isFavorite == null || !detailObj.isFavorite) {
      isFavorite = true
    }
    detailObj.isFavorite = isFavorite
    this.setState({}, () => {
      DeviceEventEmitter.emit('refreshFavorite', detailObj)
    })
  }

  renderOccupationItem = ({item}) => {
    return (
      <Text style={Styles.occupationText}>{item}</Text>
    )
  }

  renderAppearedItem = ({item}) => {
    return (
      <Text style={Styles.appearedText}>{strings.formatString(strings.season_var, item)}</Text>
    )
  }

}

const Styles = StyleSheet.create({
  centerImage: {
    width: 130,
    height: 170,
    marginTop: 70,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: MyColors.greyTitleColor,
  },
  nameText: {
    fontSize: 31,
    marginTop: 15,
    color: MyColors.whiteColor,
    fontFamily: 'Roboto-Bold',
  },
  nicknameText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    color: MyColors.whiteColor,
    fontFamily: 'Roboto-Medium',
  },
  statusText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    color: MyColors.pinkDark,
    fontFamily: 'Roboto-Regular',
  },

  potrayedText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    color: MyColors.greenDark,
    fontFamily: 'Roboto-Medium',
  },

  occupationText: {
    fontSize: 14,
    marginTop: 5,
    marginHorizontal: 20,
    color: MyColors.whiteColor,
    fontFamily: 'Roboto-Regular',
  },

  appearedText: {
    padding: 5,
    fontSize: 14,
    borderRadius: 5,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    color: MyColors.whiteColor,
    fontFamily: 'Roboto-Regular',
    backgroundColor: MyColors.seperatorWhiteColor,
  },

  dobText: {
    fontSize: 14,
    color: MyColors.whiteColor,
    fontFamily: 'Roboto-Regular',
  },


});

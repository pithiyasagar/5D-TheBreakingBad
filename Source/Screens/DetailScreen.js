import React from 'react'
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  DeviceEventEmitter,
  Dimensions
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

const screenWidth = Dimensions.get('window').width


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
              source={{uri: detailObj?.thumbnail}}>
              <LinearGradient colors={['#FFFFFF00', 'black']}
                style={{ height: '100%', width: '100%', alignItems :'center' }}>
                <FastImage style={Styles.centerImage} source={{uri: detailObj?.thumbnail}} />
                <Text style={Styles.nameText}>{detailObj?.title}</Text>
                <Text style={Styles.nicknameText}>{detailObj?.description}</Text>
                <Text style={Styles.statusText}>{detailObj?.status}</Text>
              </LinearGradient>
            </ImageBackground>
            <View style={{ flexDirection: 'row', marginHorizontal: 20, alignItems : 'center' }}>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text style={Styles.potrayedText}>{strings.potrayed}</Text>
                <Text style={[Styles.dobText, { marginTop: 5 }]}>{detailObj.portrayed}</Text>
              </View>
              {isEmpty(detailObj.birthday) || detailObj.birthday == 'Unknown' ? null :
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <Text style={Styles.dobText}>{moment(detailObj?.birthday, 'MM-DD-YYYY').format('DD-MMM-YYYY')}</Text>
                  <Icon name="gift" size={20} color="#FFF" style={{ marginStart: 10 }} />
                </View>
              }
            </View>
            <Text style={[Styles.potrayedText, { marginTop: 30, marginHorizontal: 20 }]}>{strings.occupation}</Text>
            <FlatList
              style={{ marginTop: 5 }}
              data={detailObj?.occupation}
              renderItem={this.renderOccupationItem}
              showsVerticalScrollIndicator={false}

              keyExtractor={item => item + ''}
            />
            <Text style={[Styles.potrayedText, { marginTop: 30, marginHorizontal: 20 }]}>{strings.appeared_in}</Text>
            <FlatList
              horizontal
              style={{ marginTop: 15, marginHorizontal: 15 }}
              data={detailObj?.appearance}
              renderItem={this.renderAppearedItem}
              showsHorizontalScrollIndicator={false}

              keyExtractor={item => item + ''}
            />

            <Text style={Styles.otherText}>{strings.other_characters}</Text>

            <FlatList
              horizontal
              style={{ margin: 15 }}
              data={[this.state.detailObj]}
              renderItem={this.renderItem}
              showsHorizontalScrollIndicator={false}

              keyExtractor={item => item.id + ''}
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
        style={{ position: 'absolute', marginTop: 40 }}
        onPress={() => { this.props.navigation.goBack() }}>
        <Icon name="arrow-left" size={30} color="#FFF" style={{ padding: 10 }} />
      </TouchableOpacity>
    )
  }

  renderHeart = () => {
    return (
      <TouchableOpacity
        style={{ right: 0, position: 'absolute', marginTop: 40 }}
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

  renderItem = ({item, index}) => {
    var itemWidth = screenWidth / 2 - 30;

    return (
      <View
        style={{
          width: itemWidth,
          margin: 10,
          marginBottom: 20,
        }}>
        <FastImage style={Styles.itemImage} source={{uri: item?.thumbnail}} />
        <View>
          <Text numberOfLines={1} style={Styles.itemText}>{item?.title}</Text>
          <Text numberOfLines={1} style={Styles.itemSubText}>{item?.description}</Text>
        </View>
      </View>
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
    fontFamily: 'Roboto-Regular',
    fontWeight: '600'
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
    fontFamily: 'Roboto-Regular',
    fontWeight: '600'
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

  otherText: {
    fontSize: 23,
    marginTop: 60,
    marginHorizontal: 20,
    color: MyColors.whiteColor,
    fontFamily: 'Roboto-Bold',
  },

  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: MyColors.greyTitleColor,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginTop: 5,
    paddingHorizontal: 5,
    color: MyColors.whiteColor,
    fontFamily: 'Roboto-Bold',
  },
  itemSubText: {
    fontSize: 14,
    marginTop: 5,
    paddingHorizontal: 5,
    color: MyColors.whiteColor,
    fontFamily: 'Roboto-Regular',
  },

});

import React from 'react'
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  View,
  DeviceEventEmitter
} from 'react-native';
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/FontAwesome'

import {MyColors} from '../Theme';
import strings from '../Localization/strings';
import CustomStatusBarTheme from '../Components/CustomStatusBarTheme';

const screenWidth = Dimensions.get('window').width;


export default class FavoriteScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: strings.favourites,
      headerTintColor: MyColors.greenDark,
      headerStyle: {
        backgroundColor: MyColors.blackColor,
      },
      headerTitleStyle: {
        fontFamily: 'Roboto-Bold'
      },
      headerLeft: null,
      headerRight: this.renderHeaderRight,
    })

    if (this.props.route.params != null && this.props.route.params != undefined) {
      this.setState({ list: this.props.route.params.favoriteList })
    }
  
    this.refreshFavorite = DeviceEventEmitter.addListener('refreshFavorite', item => {
      this.setState({})
    })
  }

  componentWillUnmount() {
    this.refreshFavorite.remove()
  }

  renderHeaderRight = () => {
    return (
      <TouchableOpacity style={{padding: 10}}
        onPress={() => { this.props.navigation.goBack() }}>
        <Icon name="close" size={30} color="#FFF" />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: MyColors.blackColor }}>
        <CustomStatusBarTheme />
        {this.state.list == undefined || this.state.list.length == 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={Styles.noRecordText}>{strings.no_record_found}</Text>
          </View>
        ) : (
          <FlatList
            style={{margin: 15}}
            data={this.state.list}
            renderItem={this.renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}

            keyExtractor={item => item.char_id + ''}
          />
        )}
      </SafeAreaView>
    );
  }

  renderItem = ({item, index}) => {
    var itemWidth = screenWidth / 2 - 30;

    return (
      <TouchableOpacity
        onPress={() => {
          this.itemClick(item);
        }}
        style={{
          width: itemWidth,
          margin: 10,
          marginBottom: 20,
        }}>
        <FastImage style={Styles.itemImage} source={{uri: item?.img}} />
        <View style={{}}>
          <View style={{ marginTop: 5, flexDirection: 'row' }}>
            <Text numberOfLines={1} style={Styles.itemText}>{item?.name}</Text>
            <TouchableOpacity onPress={() => { this.onFavoriteItem(item, index) }}>
              <Icon name={item?.isFavorite ? 'heart' : 'heart-o'} size={25} color='green' />
            </TouchableOpacity>
          </View>
          <Text numberOfLines={1} style={Styles.itemSubText}>{item?.nickname}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  itemClick(item) {
    this.props.navigation.navigate('DetailScreen', {
      detailObj: item,
    })
  }

  onFavoriteItem(item, index) {
    var isFavorite = false
    if (item.isFavorite == undefined || item.isFavorite == null || !item.isFavorite) {
      isFavorite = true
    }
    item.isFavorite = isFavorite
    DeviceEventEmitter.emit('refreshFavorite', item)
  }

}

const Styles = StyleSheet.create({
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: MyColors.greyTitleColor,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
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

  noRecordText: {
    fontSize: 24,
    color: MyColors.greenDark,
    fontFamily: 'Roboto-Regular',
  },

});

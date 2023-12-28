import React, { useEffect, useState } from 'react'
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

import { MyColors } from '../Theme';
import strings from '../Localization/strings';
import CustomStatusBarTheme from '../Components/CustomStatusBarTheme';
import { printOnConsole } from '../Utility/Utility';

const screenWidth = Dimensions.get('window').width;


interface Props {
  navigation: any;
  route: any;
}


const FavoriteScreen: React.FC<Props> = ({ navigation, route }) => {

  const [list, setList] = useState([])

  useEffect(() => {
    navigation.setOptions({
      title: strings.favourites,
      headerTintColor: MyColors.greenDark,
      headerStyle: {
        backgroundColor: MyColors.blackColor,
      },
      headerTitleStyle: {
        fontFamily: 'Roboto-Bold'
      },
      headerLeft: null,
      headerRight: renderHeaderRight,
    })
    
    printOnConsole('route-------------'+ JSON.stringify(route))

    if (route.params != null && route.params != undefined) {
      setList(route.params.favoriteList)
    }

    const refreshFavorite = DeviceEventEmitter.addListener('refreshFavorite', item => {
      setList([])
    })

    return (() => {
      refreshFavorite.remove()
    })

  }, [])

  function renderHeaderRight() {
    return (
      <TouchableOpacity style={{ padding: 10 }}
        onPress={() => { navigation.goBack() }}>
        <Icon name="close" size={30} color="#FFF" />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MyColors.blackColor }}>
      <CustomStatusBarTheme />
      {list == undefined || list.length == 0 ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={Styles.noRecordText}>{strings.no_record_found}</Text>
        </View>
      ) : (
        <FlatList
          style={{ margin: 15 }}
          data={list}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}

          keyExtractor={item => item.id + ''}
        />
      )}
    </SafeAreaView>
  );

  function renderItem({ item, index }) {
    var itemWidth = screenWidth / 2 - 30;

    return (
      <TouchableOpacity
        onPress={() => {
          itemClick(item);
        }}
        style={{
          width: itemWidth,
          margin: 10,
          marginBottom: 20,
        }}>
        <FastImage style={Styles.itemImage} source={{ uri: item?.thumbnail }} />
        <View style={{}}>
          <View style={{ marginTop: 5, flexDirection: 'row' }}>
            <Text numberOfLines={1} style={Styles.itemText}>{item?.title}</Text>
            <TouchableOpacity onPress={() => { onFavoriteItem(item, index) }}>
              <Icon name={item?.isFavorite ? 'heart' : 'heart-o'} size={25} color='green' />
            </TouchableOpacity>
          </View>
          <Text numberOfLines={1} style={Styles.itemSubText}>{item?.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  function itemClick(item) {
    navigation.navigate('DetailScreen', {
      detailObj: item,
    })
  }

  function onFavoriteItem(item, index) {
    var isFavorite = false
    if (item.isFavorite == undefined || item.isFavorite == null || !item.isFavorite) {
      isFavorite = true
    }
    item.isFavorite = isFavorite
    DeviceEventEmitter.emit('refreshFavorite', item)
  }

}

export default FavoriteScreen

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

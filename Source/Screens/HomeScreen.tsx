import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  View,
  Animated,
  TextInput,
  DeviceEventEmitter
} from 'react-native';
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/FontAwesome'

import { MyColors } from '../Theme';
import strings from '../Localization/strings';
import NoInternetFound from '../Components/NoInternetFound';
import { showMessageAlert, isEmpty, printOnConsole } from '../Utility/Utility';
import { isInternetAvailable, getMethodAPI } from '../API/APIClient';
import CustomStatusBarTheme from '../Components/CustomStatusBarTheme';

const screenWidth = Dimensions.get('window').width


interface Props {
  navigation: any;
  route: any;
}


const HomeScreen: React.FC<Props> = ({ navigation, route }) => {

  const [isLoading, setIsLoading] = useState(false)
  const [isInternet, setIsInternet] = useState(true)
  const [animation, setAnimation] = useState(new Animated.Value(screenWidth))
  const [onPressSearchValue, setOnPressSearchValue] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState([])
  const [favoriteList, setFavoriteList] = useState([])

  const [favorite, setFavorite] = useState(true)

  useEffect(() => {
    console.log('useEffect-----------------list', list)
  }, [list])

  useEffect(() => {
    console.log('useEffect-----------------favoriteList', favoriteList)
  }, [favoriteList])


  function setNavigation() {
    isShowSearch
      ? navigation.setOptions({
        title: '',
        headerStyle: {
          backgroundColor: '#242424',
        },
        headerRight: () => (
          <Animated.View
            style={{
              marginHorizontal: 20,
              flexDirection: 'row',
              width: screenWidth - 50,
              // left: params.animation,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              autoFocus={true}
              selectionColor={'rgba(255, 255, 255, 0.5)'}
              returnKeyType={'done'}
              style={{
                flex: 1,
                padding: 0,
                fontSize: 33,
                fontFamily: 'Roboto-Regular',
                color: MyColors.whiteColor,
                backgroundColor: 'transparent',
              }}
              placeholder={strings.search}
              placeholderTextColor={MyColors.whiteColor}
              onChangeText={handleSearchChange}
              value={keyword}
              onSubmitEditing={() => {
                searchSubmit()
              }}
              numberOfLines={1}
              underlineColorAndroid='transparent'
            />
            <TouchableOpacity
              hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
              onPress={() => {
                console.log('isShowSearch------------', !isShowSearch)
                setIsShowSearch(!isShowSearch)
                setKeyword('')
                // onClickSearch()
              }}>
              <Icon name="close" size={30} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        ),
      })
      :
      navigation.setOptions({
        title: strings.the_breaking_bad,
        headerTintColor: MyColors.whiteColor,
        headerStyle: {
          backgroundColor: MyColors.blackColor,
        },
        headerTitleStyle: {
          fontFamily: 'Roboto-Bold'
        },
        headerRight: renderHeaderRight,
      })
  }

  useEffect(() => {
    setNavigation()

    getCharactersListAPI()

    const refreshFavorite = DeviceEventEmitter.addListener('refreshFavorite', (item: { isFavorite: any; id: any; }) => {

      // var index = list.indexOf(item)
      // onFavoriteItem(item, index)

      var locaFavoriteList = favoriteList

      if (item?.isFavorite) {
        locaFavoriteList.push(item)
      } else {
        locaFavoriteList = locaFavoriteList.filter(subItem => subItem.id != item.id)
      }

      setFavoriteList(locaFavoriteList)
    })
    return (() => {
      refreshFavorite.remove()
    })
  }, [])

  useEffect(() => {
    getCharactersListAPI()
  }, [keyword])

  function onClickSearch() {
    if (isShowSearch === true) {
      setKeyword(keyword)
    }
    setOnPressSearchValue(!onPressSearchValue)
    setIsShowSearch(!isShowSearch)
    setKeyword('')

    Animated.timing(animation, {
      toValue: onPressSearchValue === true ? 0 : screenWidth,
      duration: 200,
      useNativeDriver: true, // Add This line
    }).start()
    navigation.setParams({
      animation: animation,
    })
    // setNavigation()
  }

  function handleSearchChange(text: any) {
    setKeyword(text)

    navigation.setParams({
      keyword: keyword
    })
  }

  function searchSubmit() {
    console.log(
      'route.params.keyword >>>',
      route.params.keyword,
    )
    if (route.params.keyword === '') {
      onClickSearch()
      return
    }
    getCharactersListAPI()
  }

  function renderHeaderRight() {
    return (
      <View style={{ flexDirection: 'row' }} >
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            onClickSearch()
          }}>
          <Icon name="search" size={25} color='white' />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            // let favoriteList = []
            // list.map(item => {
            //   if (item.isFavorite) {
            //     favoriteList.push(item)
            //   }
            // })
            printOnConsole('favoriteList----------------'+ favoriteList)
            navigation.navigate('FavoriteScreen', {
              favoriteList: favoriteList
            })
          }}>
          <Icon name="heart" size={25} color='green' />
        </TouchableOpacity>
      </View>
    )
  }

  function getCharactersListAPI() {
    if (isLoading) {
      return;
    }

    setIsLoading(true)

    isInternetAvailable().then(response => {
      if (response.isConnected) {
        const apifetcherObj = getMethodAPI(
          'products' + keyword,
          null,
          null,
        );
        apifetcherObj
          .then(response => {
            return Promise.all([response.status, response.json()]);
          })
          .then(res => {
            let statusCode = res[0];
            let data = res[1];
            console.log('Response >>>\n', data?.products);

            if (statusCode == 200 && data?.products != null && data?.products != undefined) {

              var newList: any[] = []

              data?.products?.map((mainItem: { id: any; isFavorite: boolean; }, mainIndex: any) => {
                var isFavorite = false
                favoriteList.map((selectedItem, selectedIndex) => {
                  if (selectedItem.id == mainItem.id) {
                    isFavorite = true
                  }
                })
                mainItem.isFavorite = isFavorite
                newList.push(mainItem)
              })

              setList(newList)
            } else if (data.message != undefined) {
              setList([])
              showMessageAlert(data.message)
            }

            setIsLoading(false)
          })
          .catch(error => {
            console.log('Error >>>\n', error);
            setIsLoading(false)
            showMessageAlert(error);
          });
      } else {
        setIsInternet(response.isConnected)
        setIsLoading(false)
      }
    });
  };

  function itemClick(item: any) {
    navigation.navigate('DetailScreen', {
      detailObj: item,
    })
  }

  function onFavoriteItem(item, index: any) {

    var isFavorite = false
    let newList = list
    var localFavoriteList = favoriteList

    if (item.isFavorite == undefined || item.isFavorite == null || !item.isFavorite) {
      isFavorite = true
      favoriteList.push(item)
      printOnConsole('if------------localFavoriteList-=-----' + localFavoriteList.length)
    } else {
      // favoriteList = [...favoriteList.filter(subItem => subItem.id != item.id)]
      setFavoriteList(favoriteList.filter(subItem => subItem.id != item.id))
      printOnConsole('else------------localFavoriteList-=-----' + localFavoriteList.length)
    }
    
    newList[index].isFavorite = isFavorite

    setList(newList)
    // setFavoriteList(localFavoriteList)
    setFavorite(!favorite)
  }

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: MyColors.blackColor }}>
      <CustomStatusBarTheme />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size='large' color={MyColors.themeColor} />
        </View>
      ) : !isInternet ? (
        <NoInternetFound
          onPress={() => {
            setList([])
            getCharactersListAPI()
          }}
        />
      ) : list == null || list == undefined || list.length == 0 ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={Styles.noRecordText}>{strings.no_record_found}</Text>
        </View>
      ) : (
        <View>
        <FlatList
          style={{ margin: 15 }}
          data={list}
          renderItem={renderItem}
          numColumns={2}
          extraData={[favoriteList.length]}
          showsVerticalScrollIndicator={false}

          keyExtractor={(item: { id: string; }) => item.id}
        />
        </View>
      )}
    </SafeAreaView>
  );

}

export default HomeScreen

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

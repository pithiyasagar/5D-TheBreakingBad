import React from 'react'
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

import {MyColors} from '../Theme';
import strings from '../Localization/strings';
import NoInternetFound from '../Components/NoInternetFound';
import {showMessageAlert, isEmpty} from '../Utility/Utility';
import {isInternetAvailable, getMethodAPI} from '../API/APIClient';
import CustomStatusBarTheme from '../Components/CustomStatusBarTheme';

const screenWidth = Dimensions.get('window').width


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isInternet: true,

      animation: new Animated.Value(screenWidth),
      onPressSearchValue: false,
      isShowSearch: false,
      keyword: '',

      list: [],
      favoriteList: [],
    };
  }

  componentDidMount() {
    this.setNavigation()

    this.getCharactersListAPI()
  
    this.refreshFavorite = DeviceEventEmitter.addListener('refreshFavorite', item => {
      // this.setState({})

      // var index = this.state.list.indexOf(item)
      // this.onFavoriteItem(item, index)

      var favoriteList = this.state.favoriteList

      if (item.isFavorite == undefined || item.isFavorite == null || !item.isFavorite) {
        favoriteList.push(item)
      } else {
        favoriteList = favoriteList.filter(subItem => subItem.char_id !== item.char_id)
      }

      this.setState({ favoriteList })
    })
  }

  componentWillUnmount() {
    this.refreshFavorite.remove()
  }

  setNavigation = () => {
    this.state.isShowSearch
      ? this.props.navigation.setOptions({
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
                  onChangeText={this.handleSearchChange}
                  value={this.state.keyword}
                  onSubmitEditing={() => {
                    this.searchSubmit()
                  }}
                  numberOfLines={1}
                  underlineColorAndroid='transparent'
                />
              <TouchableOpacity
                hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                onPress={() => {
                  this.onClickSearch()
                }}>
                <Icon name="close" size={30} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>
          ),
        })
      :
      this.props.navigation.setOptions({
        title: strings.the_breaking_bad,
        headerTintColor: MyColors.whiteColor,
        headerStyle: {
          backgroundColor: MyColors.blackColor,
        },
        headerTitleStyle: {
          fontFamily: 'Roboto-Bold'
        },
        headerRight: this.renderHeaderRight,
      })
  }

  onClickSearch() {
    if (this.state.isShowSearch === true) {
      this.setState({ keyword: '' }, () => {
          this.getCharactersListAPI()
        },
      )
    }
    this.setState({
        onPressSearchValue: !this.state.onPressSearchValue,
        isShowSearch: !this.state.isShowSearch,
        keyword: '',
      },
      () => {
        Animated.timing(this.state.animation, {
          toValue: this.state.onPressSearchValue === true ? 0 : screenWidth,
          duration: 200,
          useNativeDriver: true, // Add This line
        }).start()
        this.props.navigation.setParams({
          animation: this.state.animation,
        })
        this.setNavigation()
      },
    )
  }

  handleSearchChange = text => {
    this.setState({
        keyword: text,
      }, () => {
        this.props.navigation.setParams({
          keyword: this.state.keyword
      })
    })
  }

  searchSubmit() {
    console.log(
      'this.props.route.params.keyword >>>',
      this.props.route.params.keyword,
    )
    if (this.props.route.params.keyword === '') {
      this.onClickSearch()
      return
    }
    this.getCharactersListAPI()
  }

  renderHeaderRight = () => {
    return (
      <View style={{ flexDirection: 'row' }} >
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            this.onClickSearch()
          }}>
          <Icon name="search" size={25} color='white' />
        </TouchableOpacity>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => {
            var favoriteList = []
            this.state.list.map(item => {
              if (item.isFavorite) {
                favoriteList.push(item)
              }
            })
            this.props.navigation.navigate('FavoriteScreen', {
              favoriteList: favoriteList
            })
          }}>
          <Icon name="heart" size={25} color='green' />
        </TouchableOpacity>
      </View>
    )
  }

  getCharactersListAPI = () => {
    if (this.state.isLoading) {
      return;
    }

    this.setState({ isLoading: true })

    isInternetAvailable().then(response => {
      if (response.isConnected) {
        const apifetcherObj = getMethodAPI(
          '/api/characters?name=' + this.state.keyword,
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
            console.log('Response >>>\n', data);

            if (statusCode == 200 && data != null && data != undefined) {

              var newList = []

              data.map((mainItem, mainIndex) => {
                  var isFavorite = false
                  this.state.favoriteList.map((selectedItem, selectedIndex) => {
                      if (selectedItem.char_id == mainItem.char_id) {
                        isFavorite = true
                      }
                  })
                  mainItem.isFavorite = isFavorite
                  newList.push(mainItem)
              })

              this.setState({ list: newList })
            } else if (data.message != undefined) {
              this.setState({ list: [] })
              showMessageAlert(data.message)
            }
            this.setState({isLoading: false})
          })
          .catch(error => {
            console.log('Error >>>\n', error);
            this.setState({isLoading: false});
            showMessageAlert(error);
          });
      } else {
        this.setState({isInternet: response.isConnected, isLoading: false});
      }
    });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: MyColors.blackColor }}>
        <CustomStatusBarTheme />
        {this.state.isLoading ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size='large' color={MyColors.themeColor} />
          </View>
        ) : !this.state.isInternet ? (
          <NoInternetFound
            onPress={() => {
              this.setState({ list: [] }, () => {
                this.getCharactersListAPI()
              })
            }}
          />
        ) : this.state.list == null || this.state.list == undefined || this.state.list.length == 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={Styles.noRecordText}>{strings.no_record_found}</Text>
          </View>
        ) : (
          <FlatList
            style={{ margin: 15 }}
            data={this.state.list}
            renderItem={this.renderItem}
            numColumns={2}
            extraData={[this.state.list]}
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
        <FastImage style={Styles.itemImage} source={{uri: item.img}} />
        <View style={{}}>
          <View style={{ marginTop: 5, flexDirection: 'row' }}>
            <Text numberOfLines={1} style={Styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => { this.onFavoriteItem(item, index) }}>
              <Icon name={item.isFavorite ? 'heart' : 'heart-o'} size={25} color='green' />
            </TouchableOpacity>
          </View>
          <Text numberOfLines={1} style={Styles.itemSubText}>{item.nickname}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  itemClick(item) {
    this.props.navigation.navigate('DetailScreen', {
      detailObj: item,
    })
  }

  onFavoriteItem = (item, index) => {
    var isFavorite = false
    // var list = this.state.list
    var favoriteList = this.state.favoriteList

    if (item.isFavorite == undefined || item.isFavorite == null || !item.isFavorite) {
      isFavorite = true
      favoriteList.push(item)
    } else {
      favoriteList = favoriteList.filter(subItem => subItem.char_id !== item.char_id)
    }

    item.isFavorite = isFavorite
    // list[index].isFavorite = isFavorite
    this.setState({ 
      // list, 
      favoriteList })
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

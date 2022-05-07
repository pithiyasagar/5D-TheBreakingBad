import React from 'react';

import {
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image'

import {MyColors} from '../Theme';
import strings from '../Localization/strings';
import NoInternetFound from '../Components/NoInternetFound';
import {showMessageAlert, isEmpty} from '../Utility/Utility';
import {isInternetAvailable, getMethodAPI} from '../API/APIClient';
import CustomStatusBarTheme from '../Components/CustomStatusBarTheme';

const screenWidth = Dimensions.get('window').width;


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isInternet: true,

      list: [],
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: strings.the_breaking_bad,
      headerTintColor: MyColors.whiteColor,
      headerStyle: {
        backgroundColor: MyColors.blackColor,
      },
      // headerLeft: this.renderHeaderLeft,
    })

    this.getCharactersListAPI()
  }

  renderHeaderLeft = () => {
    return (
      <TouchableOpacity
        style={{marginLeft: 0}}
        onPress={() => {
          this.props.navigation.toggleDrawer();
        }}>
        {/* <Image source={global_images.menu_white} /> */}
      </TouchableOpacity>
    );
  };

  getCharactersListAPI = () => {
    if (this.state.isLoading) {
      return;
    }

    this.setState({isLoading: true})

    isInternetAvailable().then(response => {
      if (response.isConnected) {
        const apifetcherObj = getMethodAPI(
          '/api/characters?name=',
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

            if (statusCode == 200) {
              this.setState({list: data});
            } else if (data.message != undefined) {
              showMessageAlert(data.message);
            }
            this.setState({isLoading: false});
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
              this.setState({list: [], nextOffset: 0}, () => {
                this.getCharactersListAPI();
              });
            }}
          />
        ) : this.state.list.length == 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{strings.no_record_found}</Text>
          </View>
        ) : (
          <FlatList
            style={{margin: 15}}
            data={this.state.list}
            renderItem={this.renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    );
  }

  renderItem = ({item}) => {
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
          <View style={{ flexDirection: 'row' }}>
            <Text style={Styles.itemText}>{item.name}</Text>
            <TouchableOpacity>
              <Image source={{}} />
            </TouchableOpacity>
          </View>
          <Text style={Styles.itemSubText}>{item.nickname}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  itemClick(item) {
    this.props.navigation.navigate('DetailScreen', {
      detailObj: item,
    });
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
    fontSize: 16,
    marginTop: 5,
    paddingHorizontal: 5,
    color: MyColors.whiteColor,
    fontFamily: 'Epilogue-Bold',
  },
  itemSubText: {
    fontSize: 14,
    marginTop: 5,
    paddingHorizontal: 5,
    color: MyColors.whiteColor,
    fontFamily: 'Epilogue-Bold',
  },
});

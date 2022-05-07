import { Alert } from 'react-native';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

class Global {

  static storage = null;

  // static _storeFcmTokenAsync = async (token) => {

  //   console.log("device token stored successfully")
  //   try {
  //     await AsyncStorage.setItem('fcmToken', token);

  //     return true
  //   } catch (error) {
  //     // Error saving data
  //     // console.log("error in storing device token ", error)
  //     return false
  //   }
  // };

  static getFormatePriceWithCurrencySymbol = (price, fractionDigits, isSymbol, isFormate) => {
    // price = Math.round(price * 100) / 100
    price = parseFloat(Math.round(price * 100) / 100).toFixed(fractionDigits)
    if(price == 'NaN') {
      price = '0'
    }
    if (isFormate) {
      price = price.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',')
    }
    if (isSymbol) {
      price = '₹' + price;
    }
    return price;
    // if (objUser) {
    //   if (objUser.address.country && objUser.address.country.currency) {
    //     if (objUser.address.country.is_prefix == true) {
    //       let price2 = objUser.address.country.currency + ' ' + price;
    //       return price2;
    //     } else {
    //       let price2 = price + ' ' + objUser.address.country.currency;
    //       return price2;
    //     }
    //   } else {
    //     return price;
    //   }
    // } else {
    //   return price;
    // }
  };

  static getStorageStore() {
    //https://github.com/sunnylqm/react-native-storage

    if (Global.storage == null) {
      Global.storage = new Storage({
        // maximum capacity, default 1000
        size: 3000,

        // Use AsyncStorage for RN, or window.localStorage for web.
        // If not set, data would be lost after reload.
        storageBackend: AsyncStorage,
        defaultExpires: 1000 * 3600 * 24 * 1000,
        // cache data in the memory. default is true.
        enableCache: true,
      });
    }
    return Global.storage;
  }

  static saveLanguageCode(res) {
    const storage = Global.getStorageStore();
    storage.save({
      key: "languagecode", // Note: Do not use underscore("_") in key!
      data: res
    });
  }

  static getLanguageCode = () => {
    return Global.getStorageStore().load({
      key: "languagecode",
    });
  };

  static saveCurrentToken(token) {
    const storage = Global.getStorageStore();
    storage.save({
      key: 'accesstoken',  // Note: Do not use underscore("_") in key!
      id: '1010',	  // Note: Do not use underscore("_") in id!	
      data: token,
    });
  }

  static getCurrentToken = () => {
    return Global.getStorageStore().load({
      key: "accesstoken",
      id: '1010',
    });
  };

  static saveCurrentUser(res) {
    const storage = Global.getStorageStore();
    storage.save({
      key: "currentuser", // Note: Do not use underscore("_") in key!
      data: res
    });
  }

  static getCurrentUserPromise = () => {
    return Global.getStorageStore().load({
      key: "currentuser",
    });
  };

  static saveFCMToken(res) {
    const storage = Global.getStorageStore();
    storage.save({
      key: "fcmtocken", // Note: Do not use underscore("_") in key!
      data: res
    });
  }

  static getFCMToken = () => {
    return Global.getStorageStore().load({
      key: "fcmtocken",
    });
  };

  static saveIsFirst(res) {
    const storage = Global.getStorageStore();
    storage.save({
      key: "isfirst", // Note: Do not use underscore("_") in key!
      data: res
    });
  }

  static getIsFirst = () => {
    return Global.getStorageStore().load({
      key: "isfirst",
    });
  }

  static setIsShownHomeToolTip(res) {
    const storage = Global.getStorageStore();
    storage.save({
      key: "hometooltip", // Note: Do not use underscore("_") in key!
      data: res
    });
  }

  static getIsShownHomeToolTip = () => {
    return Global.getStorageStore().load({
      key: "hometooltip",
    });
  }

  static setIsShownTabbarToolTip(res) {
    const storage = Global.getStorageStore();
    storage.save({
      key: "tabbartooltip", // Note: Do not use underscore("_") in key!
      data: res
    });
  }

  static getIsShownTabbarToolTip = () => {
    return Global.getStorageStore().load({
      key: "tabbartooltip",
    });
  }

  static clearUserDataFromDefaults = async() => {
  
    // Global.getStorageStore().remove({key: 'languagecode'})
    Global.getStorageStore().remove({key: 'accesstoken'})
    Global.getStorageStore().remove({key: 'currentuser'})
    Global.getStorageStore().remove({key: 'fcmtocken'})

    // Global.getStorageStore().clearMapForKey('languagecode')
    Global.getStorageStore().clearMapForKey('accesstoken')
    Global.getStorageStore().clearMapForKey('currentuser')
    Global.getStorageStore().clearMapForKey('fcmtocken')

    // var languageCode = await Global.getLanguageCode()
    await Global.getStorageStore().clearMap()
    // Global.saveLanguageCode(languageCode)
    
    // Global.getStorageStore().removeItem("languagecode")
    Global.getStorageStore().removeItem("accesstoken")
    Global.getStorageStore().removeItem("currentuser")
    Global.getStorageStore().removeItem("fcmtocken")
  }

}

export default Global;

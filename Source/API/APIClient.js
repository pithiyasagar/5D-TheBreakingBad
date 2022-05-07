import { Platform } from "react-native"
import NetInfo from "@react-native-community/netinfo"
// import DeviceInfo from 'react-native-device-info'

// Live
export const BASE_URL = 'https://www.breakingbadapi.com'

export const APIConstants = {
  AuthenticationType: {
    BASIC: "Basic",
    BEARER: "Bearer",
    TOKEN: "Token"
  },
  ContentType: {
    JSON: "application/json",
    URLEncoded: "application/x-www-form-urlencoded"
  },
  HTTPMethod: {
    GET: "GET",
    DELETE: "DELETE",
    POST: "POST",
    PUT: "PUT"
  },
  StatusCode: {
    SUCCESS: 200,
    REDIRECTION: 300,
    CLIENT_ERROR: 400,
    SERVER_ERROR: 500
  }
};

export const postMethodAPI = async (url, params, token) => {
  const state = await NetInfo.fetch()
  var final_url = `${BASE_URL}${url}`;
  const config = {
    method: `${APIConstants.HTTPMethod.POST}`,
    headers: {
      "Accept": APIConstants.ContentType.JSON,
      "Content-Type": APIConstants.ContentType.JSON,
      // "app_version": DeviceInfo.getVersion(),
      'lang': 'en',
      "platform": Platform.OS,
      "Authorization": token == undefined ? "" : ("Bearer " + token),
      "ipAddress": state ?.details ?.ipAddress,
    },
    body: params
  };
  console.log("config ", config, final_url);
  return fetchWithTimeout(final_url, config);
};

export const postAPIMethodForFCMConversion = (params) => {
  var final_url = `https://iid.googleapis.com/iid/v1:batchImport`;
  const config = {
    method: `${APIConstants.HTTPMethod.POST}`,
    headers: {
      "Content-Type": APIConstants.ContentType.JSON,
      "Authorization": "key=AAAAUI8RGr8:APA91bGsyBN4Y1RrjdEZR008g-7MM3gqc0EaBhtc6oPWLtH83onLNEP5gMNHDIT_d4guKYXNc56hbLJjgESA6pfk110MvB8lAoT96fKdc_2qS2KdsdJQTAtkmjKoJpqJNrrwbJtgcfEN"
    },
    body: params
  };
  console.log("Inside postAPIMethodForFCMConversion config ", config, final_url);
  NetInfo.fetch().then(state => {
    resolve(state)
  })
  return fetch(final_url, config);
};

export const postMethodUploadImageAPI = async (url, params, token) => {
  const state = await NetInfo.fetch()
  var final_url = `${BASE_URL}${url}`;
  console.log(final_url);
  const config = {
    method: `${APIConstants.HTTPMethod.POST}`,
    headers: {
      Accept: APIConstants.ContentType.JSON,
      "Content-Type": "multipart/form-data",
      // "app_version": DeviceInfo.getVersion(),
      'lang': 'en',
      "platform": Platform.OS,
      "Authorization": token == undefined ? "" : ("Bearer " + token),
      "ipAddress": state ?.details ?.ipAddress,
    },
    body: params
  };
  console.log("config ", config);
  return fetchWithTimeout(final_url, config);
};

export const getMethodAPI = async (url, params, token) => {
  const state = await NetInfo.fetch()
  var final_url = `${BASE_URL}${url}`;
  console.log(final_url);
  const config = {
    method: `${APIConstants.HTTPMethod.GET}`,
    headers: {
      Accept: APIConstants.ContentType.JSON,
      "Content-Type": APIConstants.ContentType.JSON,
      // "app_version": DeviceInfo.getVersion(),
      'lang': 'en',
      "platform": Platform.OS,
      "Authorization": token == undefined ? "" : ("Bearer " + token),
      "ipAddress": state ?.details ?.ipAddress,
    },
  };
  console.log("config ", config);
  return fetchWithTimeout(final_url, config);
};

export const putMethodAPI = async (url, params, token) => {
  const state = await NetInfo.fetch()
  var final_url = `${BASE_URL}${url}`;
  const config = {
    method: `${APIConstants.HTTPMethod.PUT}`,
    headers: {
      "Accept": APIConstants.ContentType.JSON,
      "Content-Type": APIConstants.ContentType.JSON,
      // "app_version": DeviceInfo.getVersion(),
      'lang': 'en',
      "platform": Platform.OS,
      "Authorization": token == undefined ? "" : ("Bearer " + token),
      "ipAddress": state ?.details ?.ipAddress,
    },
    body: params
  };
  console.log("config ", config, final_url);
  return fetchWithTimeout(final_url, config);
};

export const deleteMethodAPI = async (url, params, token) => {
  const state = await NetInfo.fetch()
  var final_url = `${BASE_URL}${url}`;
  const config = {
    method: `${APIConstants.HTTPMethod.DELETE}`,
    headers: {
      "Accept": APIConstants.ContentType.JSON,
      "Content-Type": APIConstants.ContentType.JSON,
      // "app_version": DeviceInfo.getVersion(),
      'lang': 'en',
      "platform": Platform.OS,
      "Authorization": token == undefined ? "" : ("Bearer " + token),
      "ipAddress": state ?.details ?.ipAddress,
    },
    body: params
  };
  console.log("config ", config, final_url);
  return fetchWithTimeout(final_url, config);
};

async function fetchWithTimeout(resource, options = {}) {
  console.log('fetchWithTimeout--------------')

  // 2 Minute
  const { timeout = 120000 } = options;

  // 55 Seconds
  // const { timeout = 50000 } = options;
  // const { timeout = 500 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id)

  return response

  // return responseFun(response)

  //AbortError: Aborted
}

async function responseFun(mainResponse) {
  console.log('responseFun--------------', mainResponse)

  return new Promise(function (resolve, reject) {
    mainResponse.then(response => {
      console.log('--------------then')
      resolve(response)
    }).catch(error => {
      console.log('--------------error')
      reject(error)
    })
  })
}

export const isInternetAvailable = async () => {
  return new Promise(function (resolve, reject) {
    // NetInfo.addEventListener('connectionChange', (
    NetInfo.fetch().then(state => {
      resolve(state)
    }).catch((error) => {
      reject(error)
    })
    // ))
  })
}
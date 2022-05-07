import LocalizedStrings from 'react-native-localization'

let strings = new LocalizedStrings({
  en: {
    app_name: 'TheBreakingBad',

    the_breaking_bad: 'The Breaking bad',

    no_record_found: 'No record found',
    
    retry: 'Retry',
    no_internet_connection: 'No Internet Connection',
    no_internet_connection_msg:
      'You are not connected to the internet.\nMake sure WI-FI or Mobile Data is on and try again.',


  }
})

export default strings

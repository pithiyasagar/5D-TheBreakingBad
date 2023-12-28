import React from 'react';
import { Provider } from 'react-redux';

import MainApp from "./MainApp"
import { store } from './Source/redux/store';

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

const App = () => {
  return (
    <Provider store={store} >
      <MainApp />
    </Provider>
  );
};

export default App;

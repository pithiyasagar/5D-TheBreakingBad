import React from 'react';
import MainApp from "./MainApp"

if(__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

const App = () => {
  return (
    <MainApp/>
  );
};

export default App;

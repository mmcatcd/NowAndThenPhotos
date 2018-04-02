import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {StackNavigator} from 'react-navigation';

import SourcePicker from './components/SourcePicker';
import SceneList from './components/SceneList';
import NewScene from './components/NewScene';
import SceneView from './components/SceneView';
import {Font, AppLoading} from 'expo';

import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import thunk from 'redux-thunk';
import reducer from './reducers';

//For stateReconciler https://github.com/rt2zz/redux-persist#state-reconciler
const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2 // Merges two levels deep rather than at root level
}

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);


export default class App extends React.Component {
  state = {
    fontLoaded: false,
  }

  async componentDidMount() {
      await Font.loadAsync({
        'futura-medium': require('./assets/fonts/futura-medium.ttf'),
        'open-sans-light': require('./assets/fonts/OpenSans-Light.ttf'),
        'open-sans-regular': require('./assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-semibold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
      });

      this.setState({fontLoaded: true});
  }

  render() {
    if (!this.state.fontLoaded) {
      return <View />;
    }

    return( 
      <Provider store={store}>
        <PersistGate loading={<AppLoading />} persistor={persistor}>
          <StackNav />
        </PersistGate>
      </Provider>
    )
  }
}


const StackNav = StackNavigator({
    Home: {
        screen: SceneList,
    },
    SourcePicker: {
        screen: SourcePicker,
    },
    NewScene: {
      screen: NewScene
    },
    SceneView: {
      screen: SceneView
    }
}, {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#F93943',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontFamily: 'futura-medium',
        fontWeight: '200',
        color: '#fff',
        fontSize: 24,
        alignSelf:'center',
        textAlign: 'center'
      },
    }
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
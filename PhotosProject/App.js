import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {StackNavigator} from 'react-navigation';

import SceneCamera from './components/SceneCamera';
import SourcePicker from './components/SourcePicker';
import SceneList from './components/SceneList';
import NewScene from './components/NewScene';
import {Font} from 'expo';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import reducer from './reducers'

const store = createStore(reducer, applyMiddleware(thunk))


export default class App extends React.Component {
  state = {
    fontLoaded: false,
  }

  async componentDidMount() {
      await Font.loadAsync({
        'futura-medium': require('./assets/fonts/futura-medium.ttf'),
      });

      this.setState({fontLoaded: true});
  }

  render() {
    if (!this.state.fontLoaded) {
      return <View />;
    }

    return <Provider store={store}>
      <StackNav />
    </Provider>
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
    SceneCamera: {
      screen: SceneCamera
    }
}, {
    //headerMode: 'none',
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
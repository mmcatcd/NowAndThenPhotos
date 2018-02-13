import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import { Font } from 'expo';
import CameraExample from './components/CameraExample';
import TabViewExample from './components/TabViewExample';

import Scenes from './screens/Scenes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F93943',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 8,
  },
  centerHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 24,
  },
});

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
    return <Scenes />;
  }
}

/*
<View style={styles.container}>
  <View style={styles.headerContainer}>
    <View style={styles.centerHeaderContainer} >
      {
        this.state.fontLoaded ? (
          <Text style={[styles.headerText, {fontFamily: 'futura-medium'}]}>scenes</Text>
        ) : null
      }
    </View>
  </View>
  <View style={styles.contentContainer}>
    <TabViewExample />
  </View>
</View>
      */
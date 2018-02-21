import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import SceneCamera from './components/SceneCamera';
import SourcePicker from './components/SourcePicker';

export default class App extends React.Component {
  render() {
    return <SourcePicker />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import SceneButton from './SceneButton';
import NavBar from './NavBar';

export default Settings = ({deleteScene, close}) => {
  return(
    <View style={{flex: 1}}>
      <NavBar close={close} />
      <View style={styles.container}>
        <SceneButton text="Delete Scene" color="#f93943" onPress={deleteScene} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
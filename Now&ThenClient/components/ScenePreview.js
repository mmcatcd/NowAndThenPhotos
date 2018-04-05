import React from 'react';
import {
  View, 
  Text, 
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';

export default ScenePreview = ({scene, previewImage, onPress}) => {
  const photos = scene.photoIds;

  return(
    <View style={styles.container}>
      <Text style={styles.titleText}>{scene.name}</Text>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={onPress}>
          <Image source={{uri: previewImage}} style={styles.previewImage} />
        </TouchableOpacity>
        <Text style={styles.infoText}>{photos.length} photos ⋅ {scene.date}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    flex: 1
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 300/2
  },
  titleText: {
    fontFamily: 'open-sans-semibold',
    fontSize: 18,
    color: '#6A6A6A',
    marginTop: 40,
  },
  infoText: {
    fontSize: 15,
    fontFamily: 'open-sans-light',
    color: '#909090',
    marginTop: 40
  }
});
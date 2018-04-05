import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  CameraRoll,
  ToastAndroid
} from 'react-native';
import NavBar from './NavBar';
import {Video, FileSystem} from 'expo';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import postScene from '../api/postScene';

export default class Timelapse extends React.Component {
  state = {
    video: {
      mute: false,
      fullScreen: false,
      shouldPlay: false,
      isLoading: true,
      dataSource: null
    },
    response: null,
  }

  handlePlayAndPause = () => {
		this.setState(prevState => ({
			shouldPlay: !prevState.shouldPlay
		}));
	}

	handleVolume = () => {
		this.setState(prevState => ({
			mute: !prevState.mute,
		}));
  }

  saveVideo() {
    CameraRoll.saveToCameraRoll(this.props.video);
    ToastAndroid.show('Saved video to Camera Roll', ToastAndroid.SHORT);
  }

  render() {
    const { width } = Dimensions.get('window');

    const testRest = () => {
      if(!this.state.isLoading) {
        return(
          <Text>{JSON.stringify(this.state.dataSource)}</Text>
        )
      }
    }

    const renderVideo = () => {
      if(this.props.video === null) {
        return(
        <View>
          <Text>Loading video</Text>
        </View>
        )
      }

      return(
        <Video
            source={{uri: this.props.video}}
            shouldPlay={this.state.shouldPlay}
            resizeMode="cover"
            style={{ flex: 1 }}
            isMuted={this.state.mute}
            isLooping={true} />
      )
    }

    return(
      <View style={styles.container}>
        <NavBar close={this.props.close} title="timelapse" />
        <TouchableOpacity style={styles.videoContainer} onPress={this.handlePlayAndPause}>
          {renderVideo()}
        </TouchableOpacity>
        <View style={styles.shareContainer}>
          <TouchableOpacity onPress={this.saveVideo.bind(this)}>
            <MaterialIcons 
              name="save"
              size={30} 
              color="white" 
              style={styles.icon}
              />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f93943',
  },
  padding: {
    backgroundColor: '#f93943',
    height: 24
  },
  controlBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
		height: 45,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  videoContainer: {
    flex: 3,
    marginLeft: 20,
    marginRight: 20
  },
  shareContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 40,
    marginRight: 40,
    zIndex: 10000
  }
})
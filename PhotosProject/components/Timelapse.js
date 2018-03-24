import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import NavBar from './NavBar';
import {Video} from 'expo';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

export default class Timelapse extends React.Component {
  state = {
    video: {
      mute: false,
      fullScreen: false,
      shouldPlay: false,
    }
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

  render() {
    const { width } = Dimensions.get('window');

    return(
      <View style={styles.container}>
        <NavBar close={this.props.close} title="timelapse" />
        <Video
          source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
          shouldPlay={this.state.shouldPlay}
          resizeMode="cover"
          style={{ width, height: 300 }}
          isMuted={this.state.mute} />
        <View style={styles.controlBar}>
          <MaterialIcons 
            name={this.state.mute ? "volume-mute" : "volume-up"}
            size={45} 
            color="white" 
            onPress={this.handleVolume} 
          />
          <MaterialIcons 
            name={this.state.shouldPlay ? "pause" : "play-arrow"} 
            size={45} 
            color="white" 
            onPress={this.handlePlayAndPause} 
          />
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
	}
})
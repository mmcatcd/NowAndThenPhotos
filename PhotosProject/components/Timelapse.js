import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,

} from 'react-native';
import NavBar from './NavBar';
import {Video} from 'expo';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import video from '../assets/timelapse.mp4';

export default class Timelapse extends React.Component {
  state = {
    video: {
      mute: false,
      fullScreen: false,
      shouldPlay: false,
      isLoading: true,
      dataSource: null
    }
  }

  componentDidMount() {
    return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.movies
        });
      }).catch((error) => {
        console.error(error);
      })
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

    const testRest = () => {
      if(!this.state.isLoading) {
        return(
          <Text>{JSON.stringify(this.state.dataSource)}</Text>
        )
      }
    }

    return(
      <View style={styles.container}>
        <NavBar close={this.props.close} title="timelapse" />
        <TouchableOpacity style={styles.videoContainer} onPress={this.handlePlayAndPause}>
          <Video
            source={require('../assets/timelapse.mp4')}
            shouldPlay={this.state.shouldPlay}
            resizeMode="cover"
            style={{ flex: 1 }}
            isMuted={this.state.mute}
            isLooping={true}>
          </Video>   
          {/*}
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
          </View>*/}
        </TouchableOpacity>
        <View style={styles.shareContainer}>
          <MaterialIcons 
            name="save"
            size={30} 
            color="white" 
            onPress={this.handleVolume}
            style={styles.icon} />
          <MaterialIcons 
            name="share"
            size={30} 
            color="white" 
            onPress={this.handleVolume}
            style={styles.icon} />
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
    flexDirection: 'row'
  },
  icon: {
    marginLeft: 10,
    marginRight: 10
  }
})
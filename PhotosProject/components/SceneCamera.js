import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Vibration,
  CameraRoll,
  Animated,
  Easing,
  Dimensions,
  Modal,
  Platform,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';
import {Camera, Permissions, FileSystem, Location, Constants} from 'expo';
import {scaleLinear} from 'd3-scale';

import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
import Grid from './Grid';
import {getDistance} from './distance';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions

const window = Dimensions.get('window');

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
  timeInterval: 1,
  distanceInterval: 1
 };

class SceneCamera extends React.Component {
  state = {
    location: {
      latitude: 0,
      longitude: 0,
      altitude: 0
    },
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photoId: 1,
    optionsPressed : false,
    optionsHeight: new Animated.Value(5),
    overlay: false,
    grid: false,
    errorMessage: null,
    cameraHeight: null,
    overlayOpacity: 0.5,
    position: 0,
    distance: null
  }

  static navigationOptions = {
    header: null
  };

  removeLocationWatcher = null;
  dragScaleY = scaleLinear();

  async componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onMoveShouldSetResponderCapture: () => true,

      onPanResponderGrant: (e, {x0, y0}) => {
        //start gesture
        const {cameraHeight} = this.state;

        this.dragScaleY
          .domain([-y0, cameraHeight-y0])
          .range([0.5, -0.5]);
      },

      onPanResponderMove: (e, {dx, dy}) => {
        //gesture progress
        if(this.state.overlay) {
          this.setState({
            overlayOpacity: 0.5 + this.dragScaleY(dy)
          });
        }
      },

      onPanResponderRelease: (ev, {vx, vy}) => {
        //gesture complete
      }
    });

    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    const sceneId = this.props.sceneId;
    const sceneLocation = this.props.scenes[sceneId].location;

    Location.watchPositionAsync(GEOLOCATION_OPTIONS, (newLoc) => {
      const newLocation = {
        latitude: newLoc.coords.latitude,
        longitude: newLoc.coords.longitude,
        altitude: newLoc.coords.altitude
      }

      this.setState({
        location: newLocation,
        distance: getDistance(sceneLocation, newLocation)
      });
    }).then(watcher => this.removeLocationWatcher = watcher.remove);
  }

  async componentWillUnmount() {
    this.removeLocationWatcher && this.removeLocationWatcher();
  }

  handlePhoto = async () => {
    const options = { quality: 0.5, base64: false, exif: false };
    Vibration.vibrate();
    this.props.takePhoto();
    if (this.camera) {
      let photo = await this.camera.takePictureAsync(options);
      let savedUri = await CameraRoll.saveToCameraRoll(photo.uri);
      const sceneId = this.props.sceneId;

      await this.props.createPhoto(savedUri, sceneId);
      const data = this.props.scenes[sceneId].photoIds.slice().reverse();
      const images = [];

      data.map((photoId, index) => {
        const newImage = {
            url: this.props.photos[photoId].url,
            id: photoId
        }
        images[index] = newImage;
      });

      //Create new video
      console.log('sceneId', sceneId);
      const serverAdr = 'http://api.nowandthen.io';
      postScene(images, sceneId, 2)
      .then((res) => {
          console.log('response', res);
          Expo.FileSystem.downloadAsync(serverAdr + res.url, FileSystem.documentDirectory + 'video.mp4')
          .then(({uri}) => {
              CameraRoll.saveToCameraRoll(uri).then((result) => {
                  this.props.addVideo(sceneId, result);
                  deleteScene(sceneId);
              });
          });
      });
    } else {
      console.log('No camera :-(');
    }
  }

  flipCamera() {
    this.setState({
      type: this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  }

  displayOptions() {
    Animated.timing(
      this.state.optionsHeight,
      {
        toValue: this.state.optionsPressed ? 5 : 30,
        duration: 100,
        easing: Easing.quad,
        useNativeDriver: false
      }
    ).start();

    if (this.state.optionsPressed)
      this.setState({optionsPressed: false});
    else
      this.setState({optionsPressed: true});
  }

  displayOverlay() {
    this.setState({
      overlay: !this.state.overlay
    });
  }

  displayGrid() {
    this.setState({
      grid: this.state.grid ? false : true
    });
  }

  render() {
    let longLat = this.state.location;
    let distance = this.state.distance;
    let {optionsHeight} = this.state;
    const resultImg = this.props.image;

    const renderCameraFlip = () => {
      if(this.state.type == Camera.Constants.Type.back) {
        return <MaterialCommunityIcons name="camera-front" size={28} color="#F93943" style={styles.controlsIcon} />;
      } else {
        return <MaterialCommunityIcons name="camera-rear" size={28} color="#F93943" style={styles.controlsIcon} />;
      }
    }

    const {hasCameraPermission} = this.state;
    if(hasCameraPermission === null) {
      return <View />;
    } else if(hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return(
        <View style={[styles.container]}>
          <Camera
            ref={ref => {this.camera = ref;}}
            style={styles.cameraContainer}
            type={this.state.type}
            onLayout={(event) => this.setState({cameraHeight: event.nativeEvent.layout.height})}
            >
            <Animated.View style={[styles.optionsContainer, {height: optionsHeight}]}>
              {(() => {
                if(this.state.optionsPressed) {
                  return(
                    <View style={styles.optionsIconsContainer}>
                      <TouchableOpacity onPress={this.displayOverlay.bind(this)}>
                        {(() => {
                          if(this.state.overlay) {
                            return <MaterialCommunityIcons name="layers" size={20} color="#fff" style={styles.option} />;
                          } else {
                            return <MaterialCommunityIcons name="layers-off" size={20} color="#fff" style={styles.option} />;
                          }
                        })()}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.displayGrid.bind(this)}>
                        {(() => {
                          if(this.state.grid) {
                            return <MaterialCommunityIcons name="grid" size={20} color="#fff" style={styles.option} />;
                          } else {
                            return <MaterialCommunityIcons name="grid-off" size={20} color="#fff" style={styles.option} />;
                          }
                        })()}
                      </TouchableOpacity>
                      <Text style={styles.locationText}>{parseInt(distance)} metres away</Text>
                    </View>
                  )
                }
              })()}
            </Animated.View>
            <View style={{height: this.state.overlay ? this.state.cameraHeight : 0}}
              {...this.panResponder.panHandlers}>
              <TouchableWithoutFeedback>
                <View style={{flex: 1 }}>
                {resultImg && <Image 
                  source={{uri: resultImg}} 
                  style={[styles.overlayImage, {height: this.state.overlay ? this.state.cameraHeight : 0, opacity: this.state.overlayOpacity},]}
                  />
                }
                <Grid size={5} width={this.state.grid ? 2 : 0} color="rgba(255, 255, 255, 0.5)"/>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Camera>
          <View style={styles.controlsContainer} >
            <View style={styles.controls}>
              <View style={styles.controlsView}>
                <TouchableOpacity onPress={this.props.close}>
                  <Ionicons name="ios-close" size={70} color="#f93943" />
                </TouchableOpacity>
              </View>
              <View style={styles.controlsView}>
                <TouchableOpacity onPress={this.handlePhoto.bind(this)}>
                  <Ionicons name="ios-radio-button-on-outline" size={100} color="#F93943" />
                </TouchableOpacity>
              </View>
              <View style={styles.controlsView}>
                <TouchableOpacity onPress={this.displayOptions.bind(this)} >
                  <MaterialCommunityIcons name="tune" size={28} color="#F93943" style={{opacity: this.state.optionsPressed ? 1 : 0.6}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.flipCamera.bind(this)} >
                  {renderCameraFlip()}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 4,
    justifyContent: 'flex-end'
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlsView: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row'
  },
  optionsContainer: {
    width: '100%',
    backgroundColor: '#F93943',
    opacity: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0
  },
  optionsIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  option: {
    marginLeft: 10,
    marginRight: 10,
  },
  exitText: {
    color: '#F93943',
    fontSize: 28
  },
  overlayImage: {
    position: 'absolute',
    width: window.width,
    top: 0
  },
  locationText: {
    color: '#fff',
    paddingLeft: 5
  }
});


const mapStateToProps = (state, props) => ({ loading: state.sceneReducer.loading, photos: state.sceneReducer.photos, scenes: state.sceneReducer.scenes })
const mapDispatchToProps = (dispatch) => bindActionCreators(Actions, dispatch)

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SceneCamera);

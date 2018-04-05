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

const OVERLAY_COUNT = 3;

const OFF = 0;
const ONION = 1;
const SPLIT_HORIZONTAL = 2;

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
    overlayKind: 0,
    grid: false,
    errorMessage: null,
    cameraHeight: null,
    overlayOpacity: 0.5,
    position: 0,
    distance: null
  }

  overlayIs = (kind) => OVERLAY_KINDS[kind] === this.state.overlayKind;

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
        if(this.state.overlayKind === ONION) {
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
              this.props.addVideo(sceneId, uri);
              deleteScene(sceneId);
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

  advanceOverlayKind() {
    this.setState({
      overlayKind: (this.state.overlayKind + 1) % OVERLAY_COUNT,
      overlayOpacity: 0.5
    });
  }

  displayGrid() {
    this.setState({
      grid: this.state.grid ? false : true
    });
  }

  renderCameraFlip = () => {
    if(this.state.type === Camera.Constants.Type.back) {
      return <MaterialCommunityIcons name="camera-front" size={28} color="#F93943" style={styles.controlsIcon} />;
    } else {
      return <MaterialCommunityIcons name="camera-rear" size={28} color="#F93943" style={styles.controlsIcon} />;
    }
  }

  renderCurrentOverlay = () => {
    const resultImg = this.props.image;
    let overlayStyle;

    if (this.state.overlayKind === ONION) {
      overlayStyle = {viewHeight: this.state.cameraHeight, imageOpacity: this.state.overlayOpacity}
    } else if (this.state.overlayKind === SPLIT_HORIZONTAL) {
      overlayStyle = {viewHeight: this.state.cameraHeight / 2, imageTop: - this.state.cameraHeight / 2, imageOpacity: 1}
    } else {
      overlayStyle = {viewHeight: 0, imageOpacity: 0}
    }

    //  position: "absolute" on the view makes grid display properly with onion but overlay is pushed out of the way?
    // putting grid in the view as before make it work however the view is used to clip the image halfway for SPLIT_HORIZONTAL (this.state.cameraHeight / 2)
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={{height: overlayStyle["viewHeight"], overflow: "hidden"}}>
            {resultImg && <Image
              source={{uri: resultImg}}
              style={[styles.overlayImage, {height: this.state.cameraHeight, top: overlayStyle["imageTop"], opacity: overlayStyle["imageOpacity"]},]}
              />
            }
          </View>
        </View>
        {/*<Grid style={styles.grid} size={5} width={this.state.overlayKind !== SPLIT_HORIZONTAL && this.state.grid ? 2 : 0} color="rgba(255, 255, 255, 0.5)"/>*/}
      </View>
    );
  }

  render() {
    let longLat = this.state.location;
    let distance = this.state.distance;
    let {optionsHeight} = this.state;

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
                      <TouchableWithoutFeedback onPress={this.advanceOverlayKind.bind(this)}>
                        {(() => {
                          if(this.state.overlayKind === ONION) {
                            return <MaterialCommunityIcons name="layers" size={20} color="#fff" style={styles.option} />;
                          } else if(this.state.overlayKind === SPLIT_HORIZONTAL) {
                            return <MaterialCommunityIcons name="format-vertical-align-center" size={20} color="#fff" style={styles.option} />;
                          } else {
                            return <MaterialCommunityIcons name="layers-off" size={20} color="#fff" style={styles.option} />;
                          }
                        })()}
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={this.displayGrid.bind(this)}>
                        {(() => {
                          if(this.state.grid) {
                            return <MaterialCommunityIcons name="grid" size={20} color="#fff" style={styles.option} />;
                          } else {
                            return <MaterialCommunityIcons name="grid-off" size={20} color="#fff" style={styles.option} />;
                          }
                        })()}
                      </TouchableWithoutFeedback>
                      <Text style={styles.locationText}>{parseInt(distance)} metres away</Text>
                    </View>
                  )
                }
              })()}
            </Animated.View>
            {this.renderCurrentOverlay()}

            <View {...this.panResponder.panHandlers}>
            <Grid style={styles.grid}
                size={5} 
                height={this.state.cameraHeight} 
                width={this.state.overlayKind !== SPLIT_HORIZONTAL && this.state.grid ? 2 : 0} 
                color="rgba(255, 255, 255, 0.5)"/>
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
                  {this.renderCameraFlip()}
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
  grid: {
    position: 'absolute',
    top: 0,
    //zIndex: 10000000000
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

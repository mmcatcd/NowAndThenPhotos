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
    Platform
} from 'react-native';
import {Camera, Permissions, FileSystem, Location, Constants} from 'expo';

import {MaterialCommunityIcons} from '@expo/vector-icons';
import Grid from './Grid';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions

let test = new Animated.Value(5);
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
        errorMessage: null
    }

    removeLocationWatcher = null;

    async componentWillMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });

        Location.watchPositionAsync(GEOLOCATION_OPTIONS, (newLoc) => {
            this.setState({
                location: {
                    latitude: newLoc.coords.latitude,
                    longitude: newLoc.coords.longitude,
                    altitude: newLoc.coords.altitude
                }
            });
        }).then(watcher => this.removeLocationWatcher = watcher.remove);
    }

    componentWillUnmount() {
        this.removeLocationWatcher && this.removeLocationWatcher();
    }

    takePhoto = async () => {
        Vibration.vibrate();
        if (this.camera) {
            let photo = await this.camera.takePictureAsync()
            let savedUri = await CameraRoll.saveToCameraRoll(photo.uri)
            let sceneId = this.props.screenProps.sceneId

            this.props.createPhoto(savedUri, sceneId)
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
                easing: Easing.quad
            }
        ).start();

        if (this.state.optionsPressed)
            this.setState({optionsPressed: false});
        else
            this.setState({optionsPressed: true});
    }

    displayOverlay() {
        this.setState({
            overlay: this.state.overlay ? false : true
        });
    }

    displayGrid() {
        this.setState({
            grid: this.state.grid ? false : true
        });
    }

    render() {
        let longLat = this.state.location;
        console.log(longLat);
        let {optionsHeight} = this.state;
        const resultImg = this.props.navigation.state.params != null ? this.props.navigation.state.params.result.uri : null;

        const styles = StyleSheet.create({
            container: {
                flex: 1
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
            optionsIcon: {
                opacity: this.state.optionsPressed ? 1 : 0.6
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
                opacity: 0.3,
                position: 'absolute',
                width: window.width,
                top: 0
            }
        });

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
                <View style={styles.container}>
                    <Camera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.cameraContainer}
                        type={this.state.type}
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
                                            <Text>Long: {longLat.longitude}</Text>
                                            <Text>Lat: {longLat.latitude}</Text>
                                        </View>
                                    )
                                }
                            })()}
                        </Animated.View>
                        <Grid size={5} width={this.state.grid ? 2 : 0} color="rgba(255, 255, 255, 0.5)"/>
                        {resultImg && <Image source={{uri: resultImg}} style={[styles.overlayImage, {height: this.state.overlay ? window.height : 0},]} />}
                    </Camera>
                    <View style={styles.controlsContainer} >
                        <View style={styles.controls}>
                            <View style={styles.controlsView}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <Text style={styles.exitText}>X</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.controlsView}>
                                <TouchableOpacity onPress={this.takePhoto.bind(this)}>
                                    <MaterialCommunityIcons name="circle" size={80} color="#F93943" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.controlsView}>
                                <TouchableOpacity onPress={this.displayOptions.bind(this)} >
                                    <MaterialCommunityIcons name="tune" size={28} color="#F93943" style={styles.optionsIcon} />
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


const mapStateToProps = (state, props) => ({ loading: state.sceneReducer.loading, photos: state.sceneReducer.photos, scenes: state.sceneReducer.scenes })
const mapDispatchToProps = (dispatch) => bindActionCreators(Actions, dispatch)

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SceneCamera);

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
import {Camera, Permissions, FileSystem, Constants} from 'expo';

import {MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
import Grid from './Grid';

let test = new Animated.Value(5);
const window = Dimensions.get('window');

const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
    timeInterval: 1,
    distanceInterval: 1
 };

export default class NewPhoto extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        photoId: 1,
        optionsPressed : false,
        optionsHeight: new Animated.Value(5),
        grid: false,
        errorMessage: null
    }

    static navigationOptions = {
        header: null
    };

    removeLocationWatcher = null;

    async componentWillMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    componentWillUnmount() {
        this.removeLocationWatcher && this.removeLocationWatcher();
    }

    takePhoto = async () => {
        Vibration.vibrate();
        this.props.onExit();
        if (this.camera) {
            let photo = await this.camera.takePictureAsync();
            let savedUri = await CameraRoll.saveToCameraRoll(photo.uri);

            this.props.imageUpdate(savedUri);
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

    displayGrid() {
        this.setState({
            grid: this.state.grid ? false : true
        });
    }

    render() {
        let {optionsHeight} = this.state;

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
                                            <TouchableOpacity onPress={this.displayGrid.bind(this)}>
                                                {(() => {
                                                    if(this.state.grid) {
                                                        return <MaterialCommunityIcons name="grid" size={20} color="#fff" style={styles.option} />;
                                                    } else {
                                                        return <MaterialCommunityIcons name="grid-off" size={20} color="#fff" style={styles.option} />;
                                                    }
                                                })()}
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            })()}
                        </Animated.View>
                        <Grid size={5} width={this.state.grid ? 2 : 0} color="rgba(255, 255, 255, 0.5)"/>
                    </Camera>
                    <View style={styles.controlsContainer} >
                        <View style={styles.controls}>
                            <View style={styles.controlsView}>
                                <TouchableOpacity onPress={this.props.onExit}>
                                    <Ionicons name="ios-close" size={70} color="#f93943" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.controlsView}>
                                <TouchableOpacity onPress={this.takePhoto.bind(this)}>
                                    <Ionicons name="ios-radio-button-on-outline" size={100} color="#F93943" />
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

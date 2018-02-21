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
    Easing
} from 'react-native';
import {Camera, Permissions, FileSystem} from 'expo';

import {MaterialCommunityIcons} from '@expo/vector-icons';

let test = new Animated.Value(5);

export default class SceneCamera extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        photoId: 1,
        optionsPressed : false,
        optionsHeight: new Animated.Value(5),
    }

    async componentWillMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    takePhoto = async () => {
        Vibration.vibrate();
        if (this.camera) {
            let photo = await this.camera.takePictureAsync().then(data => {
                CameraRoll.saveToCameraRoll(data.uri);
            });
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
                duration: 50,
                easing: Easing.quad
            }
        ).start();

        if (this.state.optionsPressed)
            this.setState({optionsPressed: false});
        else
            this.setState({optionsPressed: true});
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
                opacity: 0.9
            },
            optionsIcon: {
                opacity: this.state.optionsPressed ? 1 : 0.6
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
                        <Animated.View style={[styles.optionsContainer, {height: optionsHeight}]} />
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
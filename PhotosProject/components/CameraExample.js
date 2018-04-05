import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Camera, Permissions} from 'expo';

export default class CameraExample extends React.Component {
    state = {
        hasCameraPermissions: null,
        type: Camera.Constants.Type.back,
    };

    async componentWillMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions: status == 'granted'
        })
    }

    render() {
        const {hasCameraPermissions} = this.state;

        if(hasCameraPermissions === null) {
            return <View />;
        } else if (hasCameraPermissions === false) {
            return <Text>No access to the camera granted</Text>;
        } else {
            return(
                <View style={{flex: 1}} >
                    <Camera style={{flex: 1}} type={this.state.type} >
                        <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row',}}>
                            <TouchableOpacity 
                                style={{flex: 0.1, alignSelf: 'flex-end', alignItems: 'center',}}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                    });
                                }} >
                                <Text style={{fontSize: 18, marginBottom: 10, color: 'white'}} >{' '}Flip{' '}</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}
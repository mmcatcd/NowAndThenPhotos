import React from 'react';

import {View, Text, Button, CameraRoll, AppRegistry} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {ImagePicker} from 'expo';

import SceneCamera from './SceneCamera';
import Map from './Map';

class SourceScreen extends React.Component {
    accessGallery() {
        console.log("Access Gallery");
        console.log(photos);
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });

        if (!result.cancelled) {
          this.props.navigation.navigate('Camera', {result});
        }
    };

    render() {
        if (!this.props.screenProps) {
            return(<Text>Loading...</Text>)
        }
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
                <Text>{JSON.stringify(this.props.screenProps)}</Text>
                <Button
                    title="Take a photo"
                    onPress={() => this.props.navigation.navigate('Camera')} />
                <Button
                    title="Choose from Gallery"
                    onPress={this.pickImage} />
                <Button
                    title="Map View"
                    onPress={() => this.props.navigation.navigate('Map')}/>
            </View>
        );
    }
}

const StackNav = StackNavigator({
    Home: {
        screen: SourceScreen,
    },
    Camera: {
        screen: SceneCamera,
    },
    Map: {
        screen: Map
    }
}, {
    headerMode: 'none',
});

export default class SourcePicker extends React.Component {
    state = {sceneId: null}

    // ScreenProps thing: https://github.com/react-navigation/react-navigation/issues/876
    componentDidMount() {
        this.setState({
            screenProps: {sceneId: this.props.navigation.state.params.sceneId}
        })
    }

    render() {
        return <StackNav screenProps={this.state.screenProps}/>;
    }
}


AppRegistry.registerComponent('SourcePicker', () => SourcePicker);

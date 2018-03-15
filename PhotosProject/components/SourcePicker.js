import React from 'react';

import {View, Text, Button, CameraRoll} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {ImagePicker} from 'expo';

import SceneCamera from './SceneCamera';
import Map from './Map';

let sceneID;

class SourceScreen extends React.Component {
    state = {
        sceneId: null,
    }

    // constructor(props) {
    //     // super(props)
    // }

    componentDidMount() {
        this.setState({
            sceneId: sceneID
        })
    }

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
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
                <Text>{this.state.sceneId}</Text>
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
    componentDidMount() {
        sceneID = this.props.navigation.state.params.sceneId;
    }
    render() {
        return <StackNav />;
    }
}

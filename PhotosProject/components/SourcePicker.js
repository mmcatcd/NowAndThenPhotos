import React from 'react';

import {View, Text, Button, CameraRoll} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {ImagePicker} from 'expo';

import SceneCamera from './SceneCamera';
import Map from './Map';

class SourceScreen extends React.Component {
    state = {}

    // constructor(props) {
    //     // super(props)
    // }

    componentDidMount() {
        let params = this.props.navigation.state.params
        console.log("params", this.props.navigation.state.params)
        this.setState({
            sceneId: params && params.sceneId
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
          this.setState({ image: result.uri });
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
    render() {
        return <StackNav />;
    }
}

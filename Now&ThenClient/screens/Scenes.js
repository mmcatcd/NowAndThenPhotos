import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Font } from 'expo';

import SceneButton from '../components/SceneButton';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
        fontFamily: 'open-sans-regular',
        color: '#909090',
        marginBottom: 20
    }
});

export default class Scenes extends React.Component {
    state = {
        fontLoaded: false,
        haveScenes: false,
        scenes: []
    }

    async componentDidMount() {
        await Font.loadAsync({
            'open-sans-regular': require('../assets/fonts/OpenSans-Regular.ttf'),
        });

        this.setState({fontLoaded: true});
    }

    addScene = () => {
        console.log("New Scene added!");
        this.setState({
            
        });
    }

    render() {
        if (!this.state.fontLoaded) {
            return <View />;
        }

        if (this.state.scenes == 0) {
            return(
                <View style={styles.container}>
                    <Text style={styles.text}>No scenez here...</Text>
                    <SceneButton 
                        color='#F93943' 
                        text="New Scene" 
                        onPress={this.addScene} />
                </View>
            );
        }
    }
}
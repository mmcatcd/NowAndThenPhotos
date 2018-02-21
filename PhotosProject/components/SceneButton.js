import React from 'react';

import { Font } from 'expo';
import {TouchableHighlight, Text, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',

        paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 75,
        paddingRight: 75,

        borderWidth: 2,
    },
    text: {
        fontSize: 16,
        fontFamily: 'open-sans-regular'
    }
});

export default class SceneButton extends React.Component {
    state = {
        fontLoaded: false,
    }

    async componentDidMount() {
        await Font.loadAsync({
            'open-sans-regular': require('../assets/fonts/OpenSans-Regular.ttf'),
        });

        this.setState({fontLoaded: true});
    }

    render() {
        if(!this.state.fontLoaded){
            return <View />;
        }

        return(
            <TouchableHighlight 
                style={[styles.button, {borderColor: this.props.color}]} 
                onPress={() => this.props.onPress()}>
                <Text style={[styles.text, {color: this.props.color}]}>{this.props.text}</Text>
            </TouchableHighlight>
        );
    }
}
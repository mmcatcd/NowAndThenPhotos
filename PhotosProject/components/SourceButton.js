import React from 'react';

import { Font } from 'expo';
import {TouchableHighlight, Text, StyleSheet, View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',

        paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 20,
        paddingRight: 20,

        marginLeft: 10,
        marginRight: 10,

        borderWidth: 3,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        fontFamily: 'open-sans-regular'
    }
});

export default class SourceButton extends React.Component {
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
                <View style={styles.container} >
                    <MaterialCommunityIcons name={this.props.icon} size={50} color="#F93943" />
                    <Text style={[styles.text, {color: this.props.color}]}>{this.props.text}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}
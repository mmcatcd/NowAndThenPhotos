import React from 'react';

import { Font } from 'expo';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',

        /*
        paddingTop: this.props.topPad != null ? this.props.topPad : 10,
        paddingBottom: this.props.topPad != null ? this.props.topPad : 10,
        paddingLeft: this.props.sidePad  != null? this.props.sidePad : 75,
        paddingRight: this.props.sidePad != null ? this.props.sidePad : 75, */

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
        const topPad = this.props.topPad != null ? this.props.topPad : 10;
        const sidePad = this.props.sidePad != null ? this.props.sidePad : 75;
        const width = this.props.width != null ? this.props.width : null

        if(!this.state.fontLoaded){
            return <View />;
        }

        return(
            <TouchableOpacity 
                style={[styles.button, {
                    borderColor: this.props.color, 
                    paddingTop: topPad, 
                    paddingBottom: topPad, 
                    width: width
                }]} 
                onPress={() => this.props.onPress()}>
                <Text style={[styles.text, {color: this.props.color}]}>{this.props.text}</Text>
            </TouchableOpacity>
        );
    }
}
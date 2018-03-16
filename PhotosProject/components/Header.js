import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import { Font } from 'expo';

const styles = StyleSheet.create({
    container: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#fff',
        fontSize: 24
    }
});

export default class Header extends React.Component {
    state = {
        fontLoaded: false,
    }

    async componentDidMount() {
        await Font.loadAsync({
            'futura-medium': require('../assets/fonts/futura-medium.ttf'),
        });

        this.setState({fontLoaded: true});
    }

    render() {
        if (!this.state.fontLoaded) {
            return <View />;
        }

        return(
            <View style={[styles.container, {backgroundColor: this.props.color != null ? this.props.color : '#F93943'}]}>
                <View style={{height: 24}} />
                <Text style={[styles.text, {fontFamily: 'futura-medium'}]}>{this.props.title}</Text>
            </View>
        );
    }
}
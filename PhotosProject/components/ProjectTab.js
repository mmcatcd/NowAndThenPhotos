import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Font } from 'expo';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 150,
        marginTop: -50,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 50, 
    },
    text: {
        marginTop: 50,
        color: '#909090',
        letterSpacing: 2,
        fontSize: 12,
    }
});

export default class ProjectTab extends React.Component {
    state = {
        fontLoaded: false,
    }

    async componentDidMount() {
        await Font.loadAsync({
          'open-sans-light': require('../assets/fonts/OpenSans-Light.ttf'),
        });

        this.setState({fontLoaded: true});
    }   
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.imageContainer} >
                    <Image source={this.props.image} style={styles.image} resizeMode='cover' />
                    <Text style={styles.text}>{this.props.photos} photos ⋅ {this.props.date}</Text>
                </View>
            </View>
        );
    }
}
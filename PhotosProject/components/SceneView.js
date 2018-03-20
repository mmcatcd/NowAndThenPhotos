import React from 'react';

import {View, Text, StyleSheet, ScrollView, ListView, Image, Dimensions} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

//Redux imports
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions

const window = Dimensions.get('window');

class SceneView extends React.Component {
    render() {
        const sceneId = this.props.navigation.state.params.sceneId;
        const data = this.props.scenes[sceneId].photoIds;
        /*const data = Object.values(this.props.scenes).find(scene => {
            return scene.id == sceneId;
        });*/
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} >
                    <View style={styles.imageContainer}>
                    {
                        data.map((photoId) => {
                            return (
                                <View style={styles.imageWrap} key={photoId}>
                                    <Image source={{uri: this.props.photos[photoId].url}} style={{flex: 1}} />
                                </View>
                            )
                        })
                    }
                    </View>
                </ScrollView>
                <BottomBar />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scrollView: {
        backgroundColor: '#fff'
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff'
    },
    imageWrap: {
        height: window.width/3,
        width: window.width/3,
        padding: 2,
    }
})

const BottomBar = () => {
    return(
        <View style={bottomBarStyles.container}>
            <MaterialCommunityIcons name='settings' size={28} color='#fff' />
            <MaterialCommunityIcons name='camera' size={28} color='#fff' />
            <MaterialCommunityIcons name='play' size={28} color='#fff' />
        </View>
    )
}

const bottomBarStyles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: '#F93943',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});

const mapStateToProps = (state, props) => ({ loading: state.sceneReducer.loading, photos: state.sceneReducer.photos, scenes: state.sceneReducer.scenes })
const mapDispatchToProps = (dispatch) => bindActionCreators(Actions, dispatch)

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SceneView);
import React from 'react';

import {View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions} from 'react-native';
import { List, ListItem } from "react-native-elements";
import {StackNavigator} from 'react-navigation';
import Swiper from 'react-native-swiper';

import SourcePicker from './SourcePicker';
import SceneForm from './SceneForm';
import SceneButton from './SceneButton';
import NewScene from './NewScene';
import ScenePreview from './ScenePreview';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions

const window = Dimensions.get('window');

class SceneList extends React.Component {
    state = { 
        newSceneVisible: false
    }

    static navigationOptions = {
        title: 'scenes',
        headerLeft: (<View />),
        headerRight: (<View />),
    };

    constructor(props) {
        super(props);
    }

    closeNewScene() {
        this.setState({newSceneVisible: false});
    }

    sceneCreated(sceneId) {
        this.setState({newSceneVisible: false});
        this.props.navigation.navigate('SceneView', {sceneId});
    }

    render() {
        //let scenes = Object.values(this.props.scenes);
        const scenes = this.props.scenes;
        const photos = this.props.photos;

        return (
            <View style={{flex: 1}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.newSceneVisible}
                    onRequestClose={this.closeNewScene.bind(this)}>
                    <NewScene 
                        sceneCreated={this.sceneCreated.bind(this)} 
                        close={this.closeNewScene.bind(this)} />
                </Modal>
                {(() => {
                    if(Object.keys(scenes).length != 0) {
                        return(
                            <View style={{alignItems: 'center'}}>
                                <View style={[styles.horizontalLine, {width: window.width - 50}]} />
                            </View>
                        );
                    }
                })()}
                <Swiper style={styles.wrapper} loop={false} showsPagination={false}>
                    {Object.entries(scenes).slice().reverse().map(([id, scene]) => {
                        const previewImageId = scene.photoIds[0];
                        let previewImage = '/';
                        if(!previewImageId == '') {
                            previewImage = photos[previewImageId].url;
                        }
                        return(
                            <View style={{flex: 1}} key={id}>
                                <ScenePreview scene={scene} previewImage={previewImage} onPress={() => this.props.navigation.navigate('SceneView', {sceneId: id})} />
                            </View>
                        )
                    })}
                </Swiper>
                <View style={styles.newSceneContainer}>
                    <SceneButton text="New Scene" color="#F93943" width={200} onPress={() => this.setState({newSceneVisible: true})} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
        paddingTop: 22,
        paddingRight: 15,
        paddingLeft: 15,
    },
    wrapper: {

    },
    horizontalLine: { 
        height: 2, 
        backgroundColor: '#CECECE', 
        position: 'absolute', 
        top: 80
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    small: {
        fontSize: 10
    },
    newSceneContainer: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})




const mapStateToProps = (state, props) => ({ loading: state.sceneReducer.loading, scenes: state.sceneReducer.scenes, photos: state.sceneReducer.photos })
const mapDispatchToProps = (dispatch) => bindActionCreators(Actions, dispatch)

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SceneList);


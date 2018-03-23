import React from 'react';

import {View, Text, StyleSheet, ScrollView, ListView, Image, Dimensions, Modal, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

//Redux imports
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions
import SceneCamera from './SceneCamera';
import RoundButton from './RoundButton';

const window = Dimensions.get('window');

class SceneView extends React.Component {
    state = {
        cameraVisible: false,
        longPressed: [],
        showDelete: false
    }

    static navigationOptions = {
        title: 'scene',
        headerRight: (<View />),
    };

    closeCamera() {
        this.setState({cameraVisible: false});
    }

    onLongPressImage(index) {
        let showDelete = false;

        this.selectImages(index);
        let {longPressed} = this.state;

        for(let i = 0; i < longPressed.length; i++) {
            if(longPressed[i]) {
                showDelete = true;
            }
        }

        this.setState({showDelete});
    }

    onPressImage(index) {
        let showDelete = false;

        if(this.state.showDelete) {
            this.selectImages(index);
        }

        let {longPressed} = this.state;

        for(let i = 0; i < longPressed.length; i++) {
            if(longPressed[i]) {
                showDelete = true;
            }
        }

        this.setState({showDelete});
    }

    selectImages(index) {
        let {longPressed} = this.state;

        if(longPressed[index] != true) {
            longPressed[index] = true;
            this.setState({longPressed});
        } else {
            longPressed[index] = false;
            this.setState({longPressed});
        }
    }

    deletePhotos() {
        const sceneId = this.props.navigation.state.params.sceneId;
        const {longPressed} = this.state;
        const data = this.props.scenes[sceneId].photoIds.slice().reverse();

        for(let i = 0; i < longPressed.length; i++) {
            if(longPressed[i]) {
                const photoId = data[i];
                this.props.deletePhoto(photoId, sceneId);
                longPressed[i] = false;
                this.setState({longPressed});
            }
        }

        this.setState({showDelete: false});
    }

    render() {
        const sceneId = this.props.navigation.state.params.sceneId;
        const data = this.props.scenes[sceneId].photoIds;
        const photoIds = this.props.scenes[sceneId].photoIds;
        const overlayPhotoId = photoIds[photoIds.length - 1];
        const {longPressed} = this.state;

        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.cameraVisible}
                    onRequestClose={this.closeCamera.bind(this)}>
                    <SceneCamera sceneId={sceneId} image={photoIds.length > 0 ? this.props.photos[overlayPhotoId].url : null} close={this.closeCamera.bind(this)} />
                </Modal>

                <ScrollView style={styles.scrollView} >
                    <View style={styles.imageContainer}>
                    {
                        data.slice().reverse().map((photoId, index) => {
                            return (
                                <TouchableOpacity 
                                    style={styles.imageWrap} 
                                    key={photoId} 
                                    onLongPress={() => this.onLongPressImage(index)}
                                    onPress={() => this.onPressImage(index)}>
                                    <Image source={{uri: this.props.photos[photoId].url}} style={{flex: 1, opacity: longPressed[index] ? 0.5 : 1}} />
                                </TouchableOpacity>
                            )
                        })
                    }
                    </View>
                </ScrollView>
                {(() => {
                    if(this.state.showDelete) {
                        return(
                            <RoundButton 
                            icon="delete" 
                            color="#f93943" 
                            iconColor="#fff"
                            bottom={70}
                            right={15}
                            onPress={this.deletePhotos.bind(this)} />
                        )
                    }
                })()}
                <BottomBar onPress={() => this.setState({cameraVisible: true})} />
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

const BottomBar = ({onPress}) => {
    return(
        <View style={bottomBarStyles.container}>
            <MaterialCommunityIcons name='settings' size={28} color='#fff' />
            <TouchableOpacity onPress={onPress}>
                <MaterialCommunityIcons name='camera' size={28} color='#fff' />
            </TouchableOpacity>
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
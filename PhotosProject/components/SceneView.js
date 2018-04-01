import React from 'react';

import {
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    ListView, 
    Image, 
    Dimensions, 
    TouchableOpacity, 
    Alert, 
    CameraRoll, 
    Animated, 
    Modal,
    Easing
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Camera, Permissions, Constants, FileSystem} from 'expo';
import {StackNavigator} from 'react-navigation';
import ImageViewer from 'react-native-image-zoom-viewer';
import NavBar from './NavBar';
import Timelapse from './Timelapse';

//Redux imports
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions
import SceneCamera from './SceneCamera';
import RoundButton from './RoundButton';
import deleteScene from '../api/deleteScene';

const window = Dimensions.get('window');
let header = false;

class SceneView extends React.Component {
    state = {
        hasCameraPermission: null,
        longPressed: [],
        showDelete: false,
        location: null,
        type: null,
        position: new Animated.Value(window.height),
        imagePreview: {
            visible: false,
            index: 0
        },
        showTimelapse: false,
        video: null
    }

    static navigationOptions = ({navigation}) => ({
        header: navigation.state.params ? navigation.state.params.header : undefined,
        title: 'scene',
        headerRight: (<View />),
    });

    componentDidMount() {
        const sceneId = this.props.navigation.state.params.sceneId;
        const data = this.props.scenes[sceneId].photoIds.slice().reverse();
        const images = [];
        const video = this.props.scenes[sceneId].video;

        data.map((photoId, index) => {
            const newImage = {
                url: this.props.photos[photoId].url,
                id: photoId
            }
            images[index] = newImage;
        });

        //Checks if no video currently exists
        if(video == null || video == undefined) {
            const serverAdr = 'http://192.168.23.72:3000';
            postScene(images, sceneId, 5)
            .then((res) => {
                console.log('response', res);
                Expo.FileSystem.downloadAsync(serverAdr + res.url, FileSystem.documentDirectory + 'video.mp4')
                .then(({uri}) => {
                    CameraRoll.saveToCameraRoll(uri).then((result) => {
                        this.props.addVideo(sceneId, result);
                        deleteScene(sceneId);
                    });
                });
            });
        }
    }

    async componentWillMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    showCamera() {
        Animated.timing(
            this.state.position,
            {
                toValue: 0,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();
        this.props.navigation.setParams({header: null});
    }

    closeCamera() {
        Animated.timing(
            this.state.position,
            {
                toValue: window.height,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();
        this.props.navigation.setParams({header: undefined});
    }

    showTimelapse() {
        this.setState({showTimelapse: true});
    }

    closeTimelapse() {
        this.setState({showTimelapse: false});
    }

    closePreview() {
        this.setState({
            imagePreview: {
                visible: false,
                index: 0
            }
        });
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

            let {longPressed} = this.state;

            for(let i = 0; i < longPressed.length; i++) {
                if(longPressed[i]) {
                    showDelete = true;
                }
            }

            this.setState({showDelete});
        } else {
            this.setState({
                imagePreview: {
                    visible: true,
                    index
                }
            })
        }
    }

    imagesSelected(longPressed) {
        let selected = 0;
        for (let i = 0; i < longPressed.length; i++) {
            if(longPressed[i]) {
                selected++;
            }
        }

        return selected;
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
        const photos = this.props.photos;
        const images = [];
        const video = this.props.scenes[sceneId].video;

        data.map((photoId, index) => {
            const newImage = {
                url: this.props.photos[photoId].url,
                id: photoId
            }
            images[index] = newImage;
        });

        if(this.imagesSelected(longPressed) !== data.length) {
            for(let i = 0; i < longPressed.length; i++) {
                if(longPressed[i]) {
                    const photoId = data[i];
                    this.props.deletePhoto(photoId, sceneId);
                    longPressed[i] = false;
                    this.setState({longPressed});
                }
            }
        } else {
            for(let i = 0; i < longPressed.length; i++) {
                longPressed[i] = false;
            }

            Alert.alert(
                'Too many images selected',
                'Please try again!',
                [
                    {text: 'OK'}
                ]
            )
        }

        this.setState({showDelete: false});

        const serverAdr = 'http://192.168.23.72:3000';
            postScene(images, sceneId, 5)
            .then((res) => {
                console.log('response', res);
                Expo.FileSystem.downloadAsync(serverAdr + res.url, FileSystem.documentDirectory + 'video.mp4')
                .then(({uri}) => {
                    CameraRoll.saveToCameraRoll(uri).then((result) => {
                        this.props.addVideo(sceneId, result);
                        deleteScene(sceneId);
                    });
                });
            });
    }

    render() {
        const sceneId = this.props.navigation.state.params.sceneId;
        const data = this.props.scenes[sceneId].photoIds;
        const photoIds = this.props.scenes[sceneId].photoIds;
        const overlayPhotoId = photoIds[photoIds.length - 1];
        const {longPressed, imagePreview, showTimelapse} = this.state;
        const video = this.props.scenes[sceneId].video;

        const dataIn = data.slice().reverse();
        let images = [];
        dataIn.map((photoId, index) => {
            const newImage = {
                url: this.props.photos[photoId].url,
                id: photoId
            }
            images[index] = newImage;
        });

        const camera = () => {
            return(
                <Animated.View style={{position: 'absolute', width: window.width, height: window.height, zIndex: 100000, transform: [{translateY: this.state.position }]}}>
                    <SceneCamera 
                        takePhoto={this.closeCamera.bind(this)} 
                        sceneId={sceneId} image={photoIds.length > 0 ? this.props.photos[overlayPhotoId].url : null} 
                        close={this.closeCamera.bind(this)} />
                </Animated.View>
            )
        }

        const {hasCameraPermission} = this.state;
        if(hasCameraPermission === null) {
            return <View />;
        } else if(hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={styles.container}>
                    <Modal
                        visible={imagePreview.visible} 
                        transparent={true}
                        animationType="slide"
                        onRequestClose={this.closePreview.bind(this)}>
                        <NavBar close={this.closePreview.bind(this)} title="preview" />
                        <ImageViewer imageUrls={images} index={imagePreview.index} />
                    </Modal>
                    <Modal
                        visible={showTimelapse}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => this.setState({showTimelapse: false})}>
                        <Timelapse images={images} scene={sceneId} video={video} close={() => this.setState({showTimelapse: false})} />
                    </Modal>
                    {camera()}
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
                    <BottomBar 
                        onPressCamera={this.showCamera.bind(this)}
                        onPressPlay={this.showTimelapse.bind(this)} />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    },
    cameraContainer: {
        height: 10,
    },
})

const BottomBar = ({onPressCamera, onPressPlay}) => {
    return(
        <View style={bottomBarStyles.container}>
            <MaterialCommunityIcons name='settings' size={28} color='#fff' />
            <TouchableOpacity onPress={onPressCamera}>
                <MaterialCommunityIcons name='camera' size={28} color='#fff' />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressPlay}>
                <MaterialCommunityIcons name='play' size={28} color='#fff' />
            </TouchableOpacity>
        </View>
    )
}

const bottomBarStyles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: '#F93943',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 11
    }
});

const mapStateToProps = (state, props) => ({ loading: state.sceneReducer.loading, photos: state.sceneReducer.photos, scenes: state.sceneReducer.scenes })
const mapDispatchToProps = (dispatch) => bindActionCreators(Actions, dispatch)

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SceneView);
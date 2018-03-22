import React from 'react';

import {
    View, 
    Text, 
    StyleSheet, 
    Alert, 
    TextInput, 
    Modal, 
    Platform, 
    KeyboardAvoidingView, 
    Keyboard,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import {ImagePicker, Location, Permissions, MapView, Constants} from 'expo';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import NavigationBar from 'react-native-navbar';
import SceneButton from './SceneButton';
import SourceButton from './SourceButton';
import Dimensions from 'Dimensions';
import NewPhoto from './NewPhoto';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const window = Dimensions.get('window');

//Redux imports
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions

const FormType = t.struct({
    name: t.String
});

let id = null;

const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
    timeInterval: 1,
    distanceInterval: 1
 };

class NewScene extends React.Component {
    state = {
        image: null,
        name: null,
        nameFocus: false,
        cameraVisible: false,
        location: {
            latitude: 0,
            longitude: 0,
            altitude: 0,
            latitudeDelta: 0.0922, 
            longitudeDelta: 0.0421
        },
        sceneLocation: null,
        searchText: null,
        locationFrom: 'GPS',
        locationSearch: null,
        keyboard: {
            show: false,
            height: 0,
            textFocused: false
        },
    }

    static navigationOptions = {
        title: 'new scene',
        headerRight: (<View />),
    };

    removeLocationWatcher = null;

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            Alert.alert(
                'Location Access Denied',
                `Location access doesn't work on the android simulator. Please try on your device!`,
                [
                    {text: 'OK'}
                ]
            )
          } else {
            this._getLocationAsync();
        }

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    _getLocationAsync = async() => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Alert.alert(
                'Location Access Denied',
                'Permission to access location was denied',
                [
                    {text: 'OK'}
                ]
            )
        }

        await Location.watchPositionAsync(GEOLOCATION_OPTIONS, (newLoc) => {
            if(this.state.locationFrom == 'GPS') {
                this.setState({
                    location: {
                        latitude: newLoc.coords.latitude,
                        longitude: newLoc.coords.longitude,
                        altitude: newLoc.coords.altitude
                    }
                });
            }
        }).then(watcher => this.removeLocationWatcher = watcher.remove);
    }

    _attemptGeocodeAsync = async () => {
        this.setState({locationFrom: 'USER'});
        try {
            if(this.state.searchText != null) {
                let locationSearch = await Location.geocodeAsync(this.state.searchText);
                this.setState({
                    location: {
                        latitude: locationSearch[0].latitude,
                        longitude: locationSearch[0].longitude,
                        altitude: locationSearch[0].altitude
                    }
                });
            }
        } catch(e) {
            Alert.alert(
                'Search Failed',
                `Couldn't find any results`,
                [
                    {text: 'OK'}
                ]
            )
        }
    }

    componentWillUnmount() {
        this.removeLocationWatcher && this.removeLocationWatcher();

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow(e) {
        this.setState({
            keyboard: {
                ...this.state.keyboard,
                show: true,
                height: e.endCoordinates.height,
            }
        });
    }

    focusLocationText() {
        this.setState({
            keyboard: {
                ...this.state.keyboard,
                textFocused: true
            }
        });
    }

    unFocusLocationText() {
        this.setState({
            keyboard: {
                ...this.state.keyboard,
                textFocused: false
            }
        });
        
    }

    _keyboardDidHide() {
        this.setState({keyboard:{show: false, height: 0}});
    }

    async handleSubmit() {
        const name = this.state.name;
        const image = this.state.image;
        const location = this.state.location;

        let containsScene = Object.values(this.props.scenes).find(scene => {
            return scene.name == name;
        })

        if(containsScene == null && image != null && name != null && location != null) {
            await this.props.createScene(name);

            id = Object.values(this.props.scenes).find(scene => {
                return scene.name == name;
            });

            id = Object.values(id)[0];

            await this.props.createPhoto(image, id);
            await this.props.addLocation(location, id);

            //this.props.navigation.navigate('SceneView', {sceneId: id});
            this.props.sceneCreated(id);
        } else if (image == null) {
            Alert.alert(
                'No Image Selected',
                'Select an image and try again.',
                [
                    {text: 'OK'}
                ]
            )
        } else if(name == null) {
            Alert.alert(
                `Invalid Title`,
                `You didn't add a title for the scene.`,
                [
                    {text: 'OK'}
                ]
            )
        } else {
            Alert.alert(
                'Invalid Title',
                'Title is already taken. Try again',
                [
                    {text: 'OK'}
                ]
            )
        }
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true
        });

        this.setState({
            image: result.uri
        });
    };

    closeModal() {
        this.setState({cameraVisible: false});
    }

    updateImage(image) {
        this.setState({image});
    }

    render() {
        const location = this.state.location;
        const keyboard = this.state.keyboard;

        if(location.latitude == 0)
            return <View />

        return(
            <View style={[styles.container, {marginTop: keyboard.textFocused ? -keyboard.height : 0}]}>
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={this.state.cameraVisible}
                    onRequestClose={this.closeModal.bind(this)}>
                    <NewPhoto onExit={this.closeModal.bind(this)} imageUpdate={this.updateImage.bind(this)} />
                </Modal>
                <NavigationBar 
                    title={navBarConfig.title} 
                    tintColor={navBarConfig.tintColor} 
                    containerStyle={navBarConfig.containerStyle}
                    leftButton={
                        <TouchableOpacity
                            onPress={() => this.props.close()}>
                            <View style={{paddingLeft: 10, paddingTop: 8}}>
                                <MaterialCommunityIcons name="close" size={28} color="#fff" />
                            </View>
                        </TouchableOpacity>
                    } />
                <View style={styles.container}>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={name => this.setState({name})}
                            underlineColorAndroid="transparent"
                            selectionColor="#f93943"
                            value={this.state.text}
                            maxLength={30}
                            onFocus={() => this.setState({nameFocus: true})}
                            onBlur={() => this.setState({nameFocus: false})}
                            placeholder="Scene Name" />
                    </View>
                    <View style={styles.buttonContainer}>
                        <SourceButton text="Take Photo" icon="camera" color="#F93943" onPress={() => this.setState({cameraVisible: true})} />
                        <SourceButton text="Camera Roll" icon="image" backgroundColor="#F93943" color="#fff" onPress={this.pickImage} />
                    </View>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            showsMyLocationButton={true}
                            showsUserLocation={true}
                            region={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.0922, 
                                longitudeDelta: 0.0421
                            }}
                        >
                            <MapView.Marker 
                                coordinate={{
                                    latitude: location.latitude,
                                    longitude: location.longitude
                                }} 
                            />
                        </MapView>
                        <View style={[styles.formContainer, {flex: 1}]}>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={text => this.setState({searchText: text})}
                                underlineColorAndroid="transparent"
                                selectionColor="#f93943"
                                value={this.state.searchText}
                                placeholder="Current Location"
                                onSubmitEditing={this._attemptGeocodeAsync}
                                onFocus={this.focusLocationText.bind(this)}
                                onBlur={this.unFocusLocationText.bind(this)}
                                />
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <SceneButton text="Create Scene" color="#f93943" width={150} topPad={5} onPress={this.handleSubmit.bind(this)} />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff", 
        flex: 1,
        justifyContent: 'center'
    },
    formContainer: {
        marginRight: 40, 
        marginLeft: 40, 
        marginBottom: 40, 
        marginTop: 10
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    mapContainer: {
        flex: 2,
        marginTop: 20,
        marginBottom: 20
    },
    map: {
        //flex: 3,
        paddingTop: 20,
        height: window.height/5
    },
    textInput: {
        height: 40, 
        borderBottomColor: '#f93943', 
        borderBottomWidth: 2
    }
});

const navBarConfig = {
    title: {
        title: 'new scene',
        tintColor: '#fff',
        style: {
            fontFamily: 'futura-medium',
            fontWeight: '200',
            fontSize: 24
        }
    },
    tintColor: '#f93943',
    containerStyle: {
        paddingTop: 5,
        paddingBottom: 5
    },

}

const mapStateToProps = (state, props) => ({ loading: state.sceneReducer.loading, photos: state.sceneReducer.photos, scenes: state.sceneReducer.scenes })
const mapDispatchToProps = (dispatch) => bindActionCreators(Actions, dispatch)

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(NewScene);
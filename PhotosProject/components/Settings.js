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
    TouchableOpacity,
    ScrollView,
    Animated,
    Easing
} from 'react-native';
import {ImagePicker, Location, Permissions, MapView, Constants} from 'expo';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import SceneButton from './SceneButton';
import SourceButton from './SourceButton';
import Dimensions from 'Dimensions';
import NewPhoto from './NewPhoto';
import NavBar from './NavBar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const window = Dimensions.get('window');

//Redux imports
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions

let id = null;

const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
    timeInterval: 1,
    distanceInterval: 1
 };

class Settings extends React.Component {
    state = {
        image: null,
        name: null,
        nameFocus: false,
        position: new Animated.Value(window.height),
        location: {
            latitude: 0,
            longitude: 0,
            altitude: 0,
            latitudeDelta: 0.0922, 
            longitudeDelta: 0.0421
        },
        sceneLocation: null,
        errorMessage: null,
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
            this.setState({
              errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
          }
    }

    componentDidMount() {
      const sceneId = this.props.scene;
      const location = this.props.scenes[sceneId].location;
      this.setState({
        location: location
      });
    }

    _attemptGeocodeAsync = async () => {
        this.setState({locationFrom: 'USER'});
        try {
            if(this.state.searchText != null) {
              let locationSearch = await Location.geocodeAsync(this.state.searchText);
              const id = this.props.scene;
              const location = {
                latitude: locationSearch[0].latitude,
                longitude: locationSearch[0].longitude,
                altitude: locationSearch[0].altitude
              }

              this.setState({
                  location: {
                      latitude: locationSearch[0].latitude,
                      longitude: locationSearch[0].longitude,
                      altitude: locationSearch[0].altitude
                  }
              });

              await this.props.addLocation(location, id);                
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

    changeName() {
      const sceneId = this.props.scene;
      const name = this.state.name;
      this.props.changeName(sceneId, name);
    }

    deleteSceneFromList() {
      const sceneId = this.props.scene;
      this.props.deleteScene(sceneId);
      this.props.onDelete();
    }

    _scrollToInput (reactNode) {
        
        this.scroll.scrollToFocusedInput(reactNode)
      }

    render() {
        const location = this.state.location;
        const keyboard = this.state.keyboard;
        const sceneId = this.props.scene;
        const sceneLocation = this.props.scenes[sceneId].location;

        let locationString = sceneLocation.longitude + ", " + sceneLocation.latitude;

        if(location.latitude == 0)
            return <View />

        return(
          <View style={[styles.container]}>
            <ScrollView>
                <KeyboardAwareScrollView>
                    <NavBar close={this.props.close} />
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
                                placeholder={this.props.scenes[sceneId].name}
                                onSubmitEditing={this.changeName.bind(this)} />
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
                                }}>
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
                                        placeholder={locationString}
                                        onSubmitEditing={this._attemptGeocodeAsync}
                                        onFocus={this.focusLocationText.bind(this)}
                                        onBlur={this.unFocusLocationText.bind(this)}
                                        />
                                </View>               
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <SceneButton text="Delete Scene" color="#f93943" width={150} topPad={5} onPress={this.deleteSceneFromList.bind(this)} />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
              </ScrollView>  
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
        paddingRight: 40, 
        paddingLeft: 40, 
        paddingBottom: 40, 
        paddingTop: 10
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 20,
    },
    mapContainer: {
        flex: 2,
        paddingTop: 20,
        paddingBottom: 20
    },
    map: {
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
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
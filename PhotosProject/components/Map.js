import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import {Constants, Location, Permissions} from 'expo';

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
  timeInterval: 1,
  distanceInterval: 1,
};

export default class Map extends React.Component {
    state = {
        loc: null,
        location: {
            coords: {
                latitude: 0,
                longitude: 0
            }
        }
    }

    removeLocationWatcher = null

    componentWillMount() {
        Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged).then(watcher => this.removeLocationWatcher = watcher.remove)
    }

    componentWillUnmount() {
        this.removeLocationWatcher && this.removeLocationWatcher()
    }

    locationChanged = (location) => {
        region = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.05
        },
        this.setState({location, region});
        this.setState({loc: location});

        console.log(this.state.location);
    }

    render() {
        return(
            <View style={{flex: 1}} >
                <Expo.MapView 
                    style={{flex: 3}}
                    showsUserLocation={true}
                    region={this.state.region} />
                <View style={{flex: 1}} >
                    <Text>Latitude: {this.state.region != null ? this.state.region.latitude : null}</Text>
                    <Text>Longitude: {this.state.region != null ? this.state.region.longitude: null}</Text>
                </View>
            </View>
        );
    }
}

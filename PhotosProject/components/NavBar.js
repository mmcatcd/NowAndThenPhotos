import React from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export default class NavBar extends React.Component {
  render() {
    return(
      <NavigationBar 
        title={{...navBarConfig.title, title: this.props.title}}
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
    );
  }
}

const navBarConfig = {
  title: {
      //title: 'new scene',
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
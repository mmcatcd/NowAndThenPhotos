import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

const SIZE = 40;
const ICON = 24;

export default RoundButton = (props) => {
  return(
    <TouchableOpacity onPress={props.onPress} style={[styles.circle, {backgroundColor: props.color, bottom: props.bottom, right: props.right}]}>
      <MaterialCommunityIcons name={props.icon} size={ICON} color={props.iconColor} style={styles.icon} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE/2,
    position: 'absolute',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10
  },
  icon: {
    marginLeft: (SIZE/2)-(ICON/2),
    marginTop: (SIZE/2)-(ICON/2)-1
  }
});
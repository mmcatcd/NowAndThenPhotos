import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

export default (props) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column'
        },
        row: {
            flex: 1,
            flexDirection: 'row'
        },
        column: {
            flex: 1,
            borderColor: props.color,
        }
    });

    return(
            <View style={styles.container}>
                <View style={styles.row}>
                    <View style={[styles.column, {borderBottomWidth: props.width}]} />
                    <View style={[styles.column, {borderLeftWidth: props.width, borderRightWidth: props.width, borderBottomWidth: props.width}]} />
                    <View style={[styles.column, {borderBottomWidth: props.width}]} />
                </View>
                <View style={styles.row}>
                    <View style={[styles.column, {borderBottomWidth: props.width}]} />
                    <View style={[styles.column, {borderLeftWidth: props.width, borderRightWidth: props.width, borderBottomWidth: props.width}]} />
                    <View style={[styles.column, {borderBottomWidth: props.width}]} />
                </View>
                <View style={styles.row}>
                    <View style={styles.column} />
                    <View style={[styles.column, {borderLeftWidth: props.width, borderRightWidth: props.width}]} />
                    <View style={styles.column} />
                </View>
            </View>
    )
}
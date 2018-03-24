import React from 'react';

import {View, Text, FlatList, StyleSheet, TouchableHighlight, Modal} from 'react-native';
import { List, ListItem } from "react-native-elements";
import {StackNavigator} from 'react-navigation';

import SourcePicker from './SourcePicker';
import SceneForm from './SceneForm';
import SceneButton from './SceneButton';
import NewScene from './NewScene';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions

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
        let scenes = Object.values(this.props.scenes)
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
                <View style={styles.container}>
                    {/*<SceneButton text="New Scene" color="#F93943" onPress={() => this.props.navigation.navigate('NewScene')} />*/}
                    <SceneButton text="New Scene" color="#F93943" onPress={() => this.setState({newSceneVisible: true})} />
                    <List>
                    <FlatList
                        data={scenes}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                        <ListItem
                            // roundAvatar
                            title={item.name}
                            subtitle={item.id}
                            onPress={() => {
                                return this.props.navigation.navigate('SceneView', {sceneId: item.id})
                            }}
                        />
                        )}
                    />
                    </List>
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
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    small: {
        fontSize: 10
    }
})




const mapStateToProps = (state, props) => ({ loading: state.sceneReducer.loading, scenes: state.sceneReducer.scenes })
const mapDispatchToProps = (dispatch) => bindActionCreators(Actions, dispatch)

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SceneList);


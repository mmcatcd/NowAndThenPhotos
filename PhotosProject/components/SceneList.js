import React from 'react';

import {View, Text, FlatList, StyleSheet, TouchableHighlight} from 'react-native';
import { List, ListItem } from "react-native-elements";
import {StackNavigator} from 'react-navigation';

import SourcePicker from './SourcePicker';
import SceneForm from './SceneForm';
import SceneButton from './SceneButton';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions'; //Import your actions

class SceneList extends React.Component {
    state = { showCreateSceneForm: false }

    static navigationOptions = {
        title: 'scenes',
    };

    constructor(props) {
        super(props);
    }

    render() {
        let scenes = Object.values(this.props.scenes)
        return (
            <View style={{flex: 1}}>
                {/*<Header title="scenes" />*/}
                <View style={styles.container}>
                    <SceneButton text="New Scene" color="#F93943" onPress={() => this.props.navigation.navigate('NewScene')} />
                    <List>
                    <FlatList
                        data={scenes}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                        <ListItem
                            // roundAvatar
                            title={item.name}
                            subtitle={item.id}
                            // onPress={() => this.props.navigation.navigate('SourcePicker', {sceneId: 8})}
                            onPress={() => {
                                console.log("Scene ID for link ", item.id)
                                return this.props.navigation.navigate('SourcePicker', {sceneId: item.id})
                            }}
                            // avatar={{ uri: item.picture.thumbnail }}
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


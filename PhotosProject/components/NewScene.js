import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import {ImagePicker} from 'expo';
import SceneButton from './SceneButton';
import SourceButton from './SourceButton';
import Header from './Header';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const FormType = t.struct({
    name: t.String
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff", 
        flex: 1,
        justifyContent: 'center',
    },
    formContainer: {
        marginRight: 20, 
        marginLeft: 20, 
        marginBottom: 40, 
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    }
});

export default class NewScene extends React.Component {
    state = {
        image: null
    }

    componentDidMount() {
        this.refs.form.getComponent('name').refs.input.focus();
    }

    handleSubmit() {
        this.props.navigation.state.params.handleSubmit(this.refs.form.getValue().name);
        this.props.navigation.navigate('Home');
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this.setState({
            image: result.uri
        });
    };

    render() {
        return(
            <View style={styles.container}>
                <Header title="new scene" />
                <View style={styles.container}>
                    <View style={styles.formContainer}><Form ref="form" type={FormType} /></View>
                    <View style={styles.buttonContainer}>
                        <SourceButton text="Take Photo" icon="camera" color="#F93943" onPress={() => this.props.navigation.navigate('SceneCamera')} />
                        <SourceButton text="Camera Roll" icon="image" color="#F93943" onPress={this.pickImage} />
                    </View>
                    <View style={{marginTop: 50, alignItems: 'center'}}>
                        <SceneButton text="Create Scene" color="#f93943" width={150} topPad={5} onPress={this.handleSubmit.bind(this)} />
                    </View>
                </View>
            </View>
        )
    }
}
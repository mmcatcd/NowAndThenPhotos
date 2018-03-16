import React from 'react';

import {View, Text} from 'react-native';
import {ImagePicker} from 'expo';
import SceneButton from './SceneButton';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const FormType = t.struct({
    name: t.String
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
        /*
        if (!result.cancelled) {
          this.props.navigation.navigate('Camera', {result});
        } */
    };

    render() {
        return(
            <View style={{backgroundColor: "#fff", flex: 1}}>
                <View>
                    <Text>New Scene</Text>
                    <Form ref="form" type={FormType} />
                    <View>
                        <SceneButton text="Take Photo" color="#F93943" onPress={() => this.props.navigation.navigate('SceneCamera')} />
                        <SceneButton text="Camera Roll" color="#F93943" onPress={this.pickImage} />

                        <SceneButton text="Create Scene" color="#F93943" onPress={this.handleSubmit.bind(this)} />
                    </View>
                </View>
            </View>
        )
    }
}
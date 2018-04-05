import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import t from 'tcomb-form-native';

import SceneButton from './SceneButton';

const Form = t.form.Form;

const FormType = t.struct({
    name: t.String
});

export default class SceneForm extends Component {
    componentDidMount() {
        this.refs.form.getComponent('name').refs.input.focus();
    }

    handleSubmit() {
        this.props.handleSubmit(this.refs.form.getValue().name)
    }

    render() {
        return (
            <View>
                <Form ref="form" type={FormType} />
                <SceneButton text="Save" color="#000000" onPress={this.handleSubmit.bind(this)}/>
            </View>
        );
    }
}

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     marginTop: 50,
//     padding: 20,
//     backgroundColor: '#ffffff',
//   },
// });

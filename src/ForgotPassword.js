import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity,
    SafeAreaView
} from 'react-native';

import { 
    Background, 
    InputText, 
    Button,
    Label
} from './styles';

import validation from './functions/validation';

import * as firebase from 'firebase';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
  
export default class ForgotPassword extends Component {

    
    _onResetPress() {

        const {email, confirm_email, errorMsg} = this.state;

        this.setState({errorMsg:''});

        if (validation.isEmailEmpty(email)) {
            this.setState({errorMsg: '* Your email is empty.'})
            return
        }

        if (validation.isNotValidEmail(email)) {
            this.setState({errorMsg: '* Your email is invalid.'})
            return
        }

        if (validation.isNotSameText(email, confirm_email)) {
            this.setState({errorMsg: '* Your email and confirm email should be matched.'})
            return
        }

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                // Password reset email sent!
                // ..
                this.setState({errorMsg: '* Reset password link has been sent to your email'})
            })
            .catch((error) => {
                
                this.setState({errorMsg:'* Your provided email not found.'});

                // ..
            });

    }

    constructor(props){
        super(props)

        this.state = {
            email: '',
            confirm_email: '',
            errorMsg: ''
        }

    }

    render(){
        return (
            <SafeAreaView style={style.background}>

                <View>

                    <TextInput 
                        style={style.textInput} 
                        placeholder='email' 
                        autoCapitalize='none' 
                        value={this.state.email}
                        onChangeText={email => this.setState({email})} />

                    <TextInput 
                        style={style.textInput} 
                        placeholder='confirm email' 
                        autoCapitalize='none' 
                        value={this.state.confirm_email}
                        onChangeText={confirm_email => this.setState({confirm_email})} />

                    <Text 
                        style={style.labelErrorMessage} >
                            {this.state.errorMsg}
                    </Text>

                    <TouchableOpacity 
                        style={style.touchButton}
                        onPress={()=>this._onResetPress()} >

                        <Text 
                            style={style.touchButtonLabel} >
                                Reset
                        </Text>

                    </TouchableOpacity>

                </View>

            </SafeAreaView>            
        )
    }

}

const style = StyleSheet.create({

    background:{
        ...Background.blue,
        ...Background.fullscreen,
        ...Background.center_content
    },

    textInput:{
        ...InputText.border,
        ...InputText.padding,
        ...InputText.color,
        ...InputText.text_alignment,
        ...InputText.side_margin,
        marginBottom: 10
    },

    touchButton: {
        ...Button.border,
        ...Button.color,
        ...Button.padding,
        ...Button.alignment,
        ...Button.side_margin,
    },

    touchButtonLabel:{
        ...Button.label
    },

    labelErrorMessage: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight,
        ...Label.red,
        marginBottom:10
    }

});



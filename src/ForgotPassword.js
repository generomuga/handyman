import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import { 
    Background, 
    InputText, 
    Button 
} from './styles';

import formValidator from './functions/formValidator';

import * as firebase from 'firebase';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
  
export default class ForgotPassword extends Component {

    
    _onResetPress() {

        const {email, confirm_email, errorMsg} = this.state;

        this.setState({errorMsg:''});

        if (formValidator.isEmailEmpty(email)) {
            this.setState({errorMsg: '* Your email is empty.'})
            return
        }

        if (formValidator.isNotValidEmail(email)) {
            this.setState({errorMsg: '* Your email is invalid.'})
            return
        }

        if (formValidator.isNotSameText(email, confirm_email)) {
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
            <View style={style.background}>

                    <TextInput 
                        style={style.textInput} 
                        placeholder='email' 
                        autoCapitalize='none' 
                        value={this.state.email}
                        onChangeText={email => this.setState({email})}
                        />

                    <TextInput 
                        style={style.textInput} 
                        placeholder='confirm email' 
                        autoCapitalize='none' 
                        value={this.state.confirm_email}
                        onChangeText={confirm_email => this.setState({confirm_email})}
                        />

                    <Text 
                        style={{alignSelf:'center',textAlign:'center', color: '#D32F2F', fontSize: 16, fontWeight: '300', marginBottom:10}}>
                            {this.state.errorMsg}
                    </Text>

                    <TouchableOpacity 
                        style={style.touchButton}
                        onPress={()=>this._onResetPress()}
                        >
                        <Text style={style.touchButtonLabel}>Reset</Text>
                    </TouchableOpacity>

            </View>            
        )
    }

}

const style = StyleSheet.create({

    background:{
        ...Background.blue,
        ...Background.fullscreen
    },

    textInput:{
        ...InputText.border,
        ...InputText.padding,
        ...InputText.color,
        ...InputText.text_alignment,
        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: 10
    },

    touchButton: {
        ...Button.border,
        ...Button.color,
        ...Button.padding,
        ...Button.alignment,
        marginLeft: '10%',
        marginRight: '10%',
        padding:'4%',
        alignSelf: 'stretch',
        marginBottom: '5%'
    },

    touchButtonLabel:{
        ...Button.label
    },

});



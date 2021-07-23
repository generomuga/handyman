import React, { useState } from 'react';
import {  
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity,
    SafeAreaView
} from 'react-native';

import { 
    Background, 
    Input, 
    Button,
    Label
} from './styles';

import validation from './functions/validation';

import * as firebase from 'firebase';
  
export default function ForgotPassword () {

    const [
        email,
        setEmail,
    ] = useState('');

    const [
        confirmEmail,
        setConfirmEmail,
    ] = useState('');

    const [
        errorMessage,
        setErrorMessage,
    ] = useState('');
    
    const onResetPassword = ({email, confirmEmail}) => {

        setErrorMessage('')

        const [resultIsEmailEmpty, messageIsEmailEmpty] = validation.isEmailEmpty(email)
        if (resultIsEmailEmpty === true) {
            setErrorMessage(messageIsEmailEmpty)
            return
        }

        const [resultIsEmailInvalid, messageIsEmailInvalid] = validation.isEmailInvalid(email)
        if (resultIsEmailInvalid === true) {
            setErrorMessage(messageIsEmailInvalid)
            return
        }

        const [resultIsEmailUnequal, messageIsEmailUnequal] = validation.isEmailUnequal(email, confirmEmail)
        if (resultIsEmailUnequal === true) {
            setErrorMessage(messageIsEmailUnequal)
            return
        }

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                setErrorMessage('Reset password link has been sent to your email')
            })
            .catch((error) => {
                setErrorMessage('Your provided email not found.')
            });
    }

    return (
        <SafeAreaView style={style.background}>

            <TextInput 
                style={style.textInput} 
                placeholder='email' 
                autoCapitalize='none' 
                value={email}
                onChangeText={email => setEmail(email)} />

            <TextInput 
                style={style.textInput} 
                placeholder='confirm email' 
                autoCapitalize='none' 
                value={confirmEmail}
                onChangeText={confirmEmail => setConfirmEmail(confirmEmail)} />

            <Text 
                style={style.labelErrorMessage} >
                    {errorMessage}
            </Text>

            <TouchableOpacity 
                style={style.touchButton}
                onPress={()=> onResetPassword({email, confirmEmail})} >

                <Text 
                    style={style.touchButtonLabel} >
                        Reset
                </Text>

            </TouchableOpacity>

        </SafeAreaView>            
    )

}

const style = StyleSheet.create({

    background:{
        ...Background.blue,
        ...Background.fullscreen,
        ...Background.center_content
    },

    textInput:{
        ...Input.border,
        ...Input.padding,
        ...Input.color,
        ...Input.text_alignment,
        ...Input.side_margin,
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



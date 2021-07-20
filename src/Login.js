import React, { useState, useEffect } from 'react';

import { 
    Image, 
    SafeAreaView, 
    View,
    TextInput, 
    Text, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';

import { 
    Background, 
    Button,
    InputText,
    Label
} from './styles';

import validation from './functions/validation';
import database from './functions/database';
import authentication from './functions/authentication';

import { 
    FontAwesome5, 
    FontAwesome 
} from '@expo/vector-icons';

import * as firebase from 'firebase';

database.init();

export default function Login (props) {

    const [
        email,
        setEmail,
    ] = useState('');

    const [
        password,
        setPassword,
    ] = useState('');

    const [
        errorMessage,
        setErrorMessage,
    ] = useState('');

    useEffect(() => {
        checkIfLoggedIn()
    });
  
    const checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const user = firebase.auth().currentUser;

                if (user !== null) {
                    const emailVerified = user.emailVerified;
                    database.isUserExists(user);

                    if (emailVerified === true) {
                        clearState()
                        props.navigation.navigate('Home')
                    }
                    else {
                        setErrorMessage('* Please verify your account through your email')
                        props.navigation.navigate('Login')
                    }
                }
            }
            else {
                props.navigation.navigate('Login')
            }
        }
    )};

    const onLogin = ({email, password}) => {
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

        const [resultIsPasswordEmpty, messageIsPasswordEmpty] = validation.isPasswordEmpty(password)
        if (resultIsPasswordEmpty === true) {
            setErrorMessage(messageIsPasswordEmpty)
            return
        }

        // TODO: Put it in authentication class
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const emailVerified = user.emailVerified;
        
                if (emailVerified === true) {
                    // Do nothing
                    props.navigation.navigate('Home')
                    clearState()
                }
                else {
                    setErrorMessage('Please verify your account through your email')
                }
            })
            .catch((error) => {
                setErrorMessage('Your email or password is incorrect.')
            });
    }

    const clearState = () => {
        setEmail('')
        setPassword('')
        setErrorMessage('')
    }

    return (
        <SafeAreaView style={style.background}>
            
            <View style={style.viewLogo}>

                <Image 
                    source={require('../assets/hugefort-ico.png')}
                    style={style.logo} />

            </View>

            <View style={style.viewTextInput}>

                <TextInput 
                    style={style.textInput} 
                    placeholder='email' 
                    autoCapitalize='none' 
                    value={email}
                    onChangeText={email => setEmail(email)} />

                <TextInput 
                    style={style.textInput} 
                    placeholder='password' 
                    secureTextEntry={true} 
                    autoCapitalize='none' 
                    value={password}
                    onChangeText={password => setPassword(password)} />

                <Text style={style.labelErrorMessage}>
                    {errorMessage}
                </Text>

                <TouchableOpacity 
                    style={style.touchButton}
                    onPress={()=> onLogin({email, password})} >

                    <Text style={style.touchButtonLabel}>
                        Login
                    </Text>

                </TouchableOpacity>

                <Text 
                    style={style.forgotPassword}
                    onPress={()=>props.navigation.navigate('ForgotPassword')}
                    >
                    Forgot password
                </Text>
                
            </View>

            <View style={style.viewSocialMedia}>

                <Text style={style.connect}>
                    ~ or connect with ~
                </Text>

                <View style={style.viewGoogleFb}>

                    <FontAwesome 
                        name='google-plus-official' 
                        size={77} 
                        color='#d34836' 
                        style={style.google}
                        onPress={() => authentication.signInWithGoogleAsync()} />

                    <FontAwesome5 
                        name='facebook' 
                        size={68} 
                        color='#4267B2'
                        style={style.facebook}
                        onPress={()=> alert('Temporarily disabled')} />

                </View>
                
                <Text
                    style={style.signUp}
                    onPress={()=>props.navigation.navigate('Signup')}>
                        Don't have an account? Sign up here
                </Text>

            </View>

        </SafeAreaView>
    )
}

const style = StyleSheet.create({

    background:{
        ...Background.blue,
        ...Background.fullscreen,
        ...Background.center_content
    },

    viewLogo: {
        flex: 3, 
        justifyContent: 'flex-start'
    },

    logo: {
        width: 300,
        height: 300, 
        alignSelf:'center',
    },

    viewTextInput: {
        flex: 3.5, 
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

    labelErrorMessage: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight,
        ...Label.red,
        marginBottom:10
    },

    touchButton: {
        ...Button.border,
        ...Button.color,
        ...Button.padding,
        ...Button.alignment,
        ...Button.side_margin,
        marginBottom: 20,
    },

    touchButtonLabel:{
        ...Button.label
    },

    forgotPassword: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight
    },

    viewSocialMedia: {
        flex: 3.5, 
        ...Background.center_content
    },

    connect: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight
    },

    viewGoogleFb: {
        marginTop: 10,
        flexDirection: 'row',
        alignSelf: 'center',
    },

    google: {
        alignSelf:'center',
        margin: 10
    },

    facebook: {
        alignSelf:'center',
        margin: 10
    },

    signUp: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight,
        marginTop: 10
    }

});
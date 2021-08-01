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

import Spinner from 'react-native-loading-spinner-overlay';

import * as Google from 'expo-google-app-auth';

import { 
    Background, 
    Button,
    Input,
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

    const [
        isLoading,
        setIsLoading
    ] = useState(false)

    useEffect(() => {
        let isSubscribed = true
        if (isSubscribed) {
            checkIfLoggedIn()
        }
        return () => isSubscribed = false
    }, []);
  
    const checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const user = firebase.auth().currentUser;

                // console.log(user)

                if (user !== null) {
                    const emailVerified = user.emailVerified;
                    const contactNumber = user.phoneNumber;

                    isUserExists(user);

                    if (emailVerified === true || contactNumber.length > 1) {
                        console.log('Pasok')
                        setIsLoading(false)
                        clearState()
                        props.navigation.navigate('Home')
                    }
                    else {
                        console.log('Hindi pasok')
                        setErrorMessage('* Please verify your account through your email')
                        props.navigation.navigate('Login')
                    }
                }
            }
            else {
                console.log('Male')
                props.navigation.navigate('Login')
            }
        }
        
    )};

    const isUserExists = (user) => {
        const dbRef = firebase.database().ref();

        dbRef.child('users').child(user['uid']).get()                        
            .then(snapshot => {
                if (snapshot.exists()) {
                    console.log('user found');
                } else {
                    console.log('user not found');
                    registerUser(user);
                }
            });
    }

    const registerUser = (user) => {

        let signInMethod = ''
        if (user.emailVerified) {
            signInMethod = 'email'
        }
        if (user.phoneNumber) {
            signInMethod = 'phone'
        }

        console.log(signInMethod)

        firebase
            .database()
            .ref('users/' + user['uid'])
            .set({
                displayName: user['displayName'] ? user['displayName'] : '',
                gender: user['gender'] ? user['gender'] : '',
                email: user['email']? user['email'] : '',
                emailVerified: user['emailVerified'],
                photoURL: user['photoURL'] ? user['photoURL'] : '',
                contactNo: user['phoneNumber'] ? user['phoneNumber'] : '',
                address: user['address'] ? user['address'] : '',
                signInMethod: signInMethod
            });
    }

    const signInWithGoogleAsync = async() => {
        try {
            setIsLoading(true)
            const result = await Google.logInAsync({
              androidClientId: '876177652588-5fiqiq2vna74qg6aklen12vd1hpre723.apps.googleusercontent.com',
              iosClientId: '876177652588-s599pfq4cm2k0lotu9erv319kbn1ibh9.apps.googleusercontent.com',
              scopes: ['profile', 'email']}
            );
            if (result.type === 'success') {
                onSignIn(result);
                return result.accessToken;
            } 
            else {
                setIsLoading(false)
                return { cancelled: true };
            }
        } 
        catch (e) {
          setIsLoading(false)
          return { error: true };
        }
        
    }

    const onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);

        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqualGoogle(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    // googleUser.getAuthResponse().id_token);
                    googleUser.idToken,
                    googleUser.accessToken
                );
                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential)
                    .catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                    });
                } 
            else {
                console.log('User already signed-in Firebase.');
            }
        });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User logged in already or has just logged in.
              console.log('UID'+user['uid']);
            //   this.registerUser(user['uid'], user['displayName'], user['email']);
            } else {
              // User not logged in or has just logged out.
            }
          });
    }

    const isUserEqualGoogle = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    return true;
                }
            }
        }
        return false;
    }

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

        setIsLoading(true)

        // TODO: Put it in authentication class
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const emailVerified = user.emailVerified;
        
                if (emailVerified === true) {
                    // Do nothing
                    setIsLoading(false)
                    props.navigation.navigate('Home')
                    clearState()
                }
                else {
                    setIsLoading(false)
                    setErrorMessage('Please verify your account through your email')
                }
            })
            .catch((error) => {
                setIsLoading(false)
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
            
            <Spinner
                visible={isLoading}
                textContent={'Loading...'} 
                textStyle={style.spinnerTextStyle}
                />

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
                    style={[
                        style.button, 
                        {marginBottom: 20}
                    ]}
                    onPress={()=> onLogin({email, password})} >

                    <Text style={style.touchButtonLabel}>
                        Login
                    </Text>

                </TouchableOpacity>

                <Text 
                    style={style.forgotPassword}
                    onPress={()=>props.navigation.navigate('ForgotPassword')} >
                    Forgot password
                </Text>
                
            </View>

            <View style={style.viewSocialMedia}>

                <Text style={style.connect}>
                    ~ or connect with ~
                </Text>

                <View style={style.viewGoogleFb}>

                    <FontAwesome5 
                        name="google-plus-square" 
                        size={68}
                        color="#d34836" 
                        style={style.google}
                        onPress={() =>
                            // setIsLoading(true);
                            signInWithGoogleAsync()} />

                    {/* <FontAwesome5
                        name="facebook-square" 
                        size={68} 
                        style={style.facebook}
                        color="#4267B2" 
                        onPress={()=> {
                            setIsLoading(true)
                            alert('Temporarily disabled')
                            setIsLoading(false)
                            }} /> */}

                    <FontAwesome5 
                        name="phone-square" 
                        size={68}
                        style={style.phone}
                        color="green" 
                        onPress={()=>{
                            setIsLoading(true)
                            props.navigation.navigate('PhoneSignIn')
                            setIsLoading(false)
                            }
                        } />

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

    button: {
        ...Button.standard,
        marginLeft: 40,
        marginRight: 40
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
        ...Input.border,
        ...Input.padding,
        ...Input.color,
        ...Input.text_alignment,
        ...Input.side_margin,
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

    phone: {
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
    },

    spinnerTextStyle: {
        color: '#FFF'
    },

});
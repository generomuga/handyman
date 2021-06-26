import React, { Component } from 'react';
import { 
    Image, 
    View, 
    TextInput, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Alert 
} from 'react-native';

import { 
    Background, 
    InputText, 
    Button 
} from './styles';

import {
    GoogleSignIn
} from './functions';

import * as firebase from 'firebase';
import { firebaseConfig } from './config/config';

import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';

import { 
    FontAwesome5, 
    FontAwesome 
} from '@expo/vector-icons';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class Login extends Component {

    componentDidMount() {
      this.checkIfLoggedIn();
    }
  
    fbLogIn = async() => {
        try {
          await Facebook.initializeAsync({
            appId: '489615325448707',
          });
          const {
            type,
            token
            // expirationDate,
            // permissions,
            // declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile'],
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            // #console.log((await response.json()).appId)
            Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
            const credential = firebase.auth.FacebookAuthProvider.credential(token)
            // firebase.auth().signInWithCredential(credential).catch((error) => {
            //   console.log(error)
            // })
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
    }

    checkLoginState = (response) => {
        if (response.authResponse) {
          // User is signed-in Facebook.
          var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe(); 
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqualFacebook(response.authResponse, firebaseUser)) {
                // Build Firebase credential with the Facebook auth token.
                var credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
                // Sign in with the credential from the Facebook user.
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
            } else {
              // User is already signed-in Firebase with the correct user.
            }
          });
        } 
        else {
          // User is signed-out of Facebook.
          // firebase.auth().signOut();
          // console.log('Eyys')
        }
    }

    isUserEqualGoogle = (googleUser, firebaseUser) => {
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

    isUserEqualFacebook = (facebookAuthResponse, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === facebookAuthResponse.userID) {
                    return true;
                }
            }
        }
        return false;
    }

    onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqualGoogle(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    // googleUser.getAuthResponse().id_token);
                    googleUser.idToken,
                    googleUser.accessToken
                );
                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential).catch((error) => {
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
    }

    signInWithGoogleAsync = async() => {
        try {
            const result = await Google.logInAsync({
              androidClientId: '876177652588-5fiqiq2vna74qg6aklen12vd1hpre723.apps.googleusercontent.com',
              iosClientId: '876177652588-s599pfq4cm2k0lotu9erv319kbn1ibh9.apps.googleusercontent.com',
              scopes: ['profile', 'email']}
            );
            if (result.type === 'success') {
                this.onSignIn(result);
                return result.accessToken;
            } 
            else {
                return { cancelled: true };
            }
        } 
        catch (e) {
          return { error: true };
        }
        
    }

    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            
          if (user) {
              const user = firebase.auth().currentUser;
                if (user !== null) {
                 
                  const emailVerified = user.emailVerified;
                
                  console.log(emailVerified);

                  if (emailVerified === 'true') {
                    this.props.navigation.navigate('Home')
                  }
                  else {
                    this.props.navigation.navigate('Login')
                  }
                }

            }
            else {
                this.props.navigation.navigate('Login')
            }
        }
    )}

    constructor(props){
        super(props)
    }

    render(){
        return (
            <View style={style.background}>
                
                <View>

                    <Image 
                        source={require('../assets/hugefort-ico.png')}
                        style={style.logo} />
                  
                    <Text
                      style={style.tagline}>
                        Best Service. Right Time. Right People 
                    </Text>

                </View>

                <View>

                    <TextInput 
                        style={style.textInput} 
                        placeholder='email' 
                        autoCapitalize='none' />

                    <TextInput 
                        style={style.textInput} 
                        placeholder='password' 
                        secureTextEntry={true} 
                        autoCapitalize='none' />

                    <TouchableOpacity style={style.touchButton}>
                        <Text style={style.touchButtonLabel}>Login</Text>
                    </TouchableOpacity>

                </View>

                <View>
                    <Text style={style.forgotPassword}>
                        Forgot password
                    </Text>
                    
                    <Text style={style.connect}>
                        ~ or connect with ~
                    </Text>

                    <View style={style.viewGoogleFb}>

                        <FontAwesome 
                          name="google-plus-official" 
                          size={77} 
                          color="#d34836" 
                          style={style.google}
                          onPress={() => this.signInWithGoogleAsync()}
                          />

                        <FontAwesome5 
                          name="facebook" 
                          size={68} 
                          color="#4267B2" 
                          style={style.facebook}
                          />

                    </View>

                    <Text
                      style={style.signUp}
                      onPress={()=>this.props.navigation.navigate('Signup')}>
                        Don't have an account? Sign up here
                    </Text>

                </View>

            </View>
        )
    }

}

const style = StyleSheet.create({

    logo: {
        width: 300,
        height: 300, 
        alignSelf:'center', 
        marginTop:'10%' ,
    },

    tagline:{
        textAlign: 'center',
        position: 'absolute',
        alignSelf: 'center',
        marginTop: '58%',
        fontSize: 18,
        fontWeight: '400' 
    },

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
        marginBottom: '3%',
        top: '-25%',
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
        top:'-20%',
    },

    touchButtonLabel:{
        ...Button.label
    },

    forgotPassword: {
        alignSelf:'center',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '300',
        marginTop: '-1%'
    },

    connect: {
        alignSelf:'center',
        fontSize: 16,
        fontWeight: '300',
        marginTop: '8%'
    },

    viewGoogleFb: {
        marginTop: '5%',
        flexDirection: 'row',
        alignSelf: 'center',
    },

    google: {
        alignSelf:'center',
        margin: '2%'
    },

    facebook: {
        alignSelf:'center',
        margin: '2%'
    },

    signUp: {
        alignSelf:'center',
        fontSize: 16,
        fontWeight: '300',
        marginTop: '5%'
    }

});
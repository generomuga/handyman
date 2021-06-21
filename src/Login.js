import React, { Component } from 'react';
import { Image, View, TextInput, Text, TouchableHighlight, StyleSheet, Alert } from 'react-native';

import * as firebase from 'firebase';
import { firebaseConfig } from './config/config';

import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';

import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

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
            var credential = firebase.auth.FacebookAuthProvider.credential(
                response.authResponse.accessToken);
    
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
      } else {
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
            // We don't need to re-auth the Firebase connection.
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
        } else {
          console.log('User already signed-in Firebase.');
        }
      });
    }

    signInWithGoogleAsync = async() => {
      try {
          const result = await Google.logInAsync({
            // androidClientId: YOUR_CLIENT_ID_HERE,
            iosClientId: '199145126003-0nnmv1svb19unku0arss5vuq6q0r2kqo.apps.googleusercontent.com',
            scopes: ['profile', 'email']}
          );
        
          if (result.type === 'success') {
            this.onSignIn(result);
            return result.accessToken;
          } else {
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
              this.props.navigation.navigate('Home')
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
                
                <Image 
                    source={require('../assets/hugefort-ico.png')}
                    style={{ width: 300, height: 300, alignSelf:'center', marginTop:'10%' }} />

                <Text
                  style={
                    {
                      alignSelf:'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'absolute',
                      top: 230, left:0, bottom: 0, right: 0,
                      fontSize: 16
                    }
                  }
                  >
                    Best Service. Right Time. Right People 
                </Text>

                <TextInput 
                    style={style.textinput} 
                    placeholder='email or mobile' 
                    autoCapitalize='none' />
                <TextInput 
                    style={style.textinput} 
                    placeholder='password' 
                    secureTextEntry={true} 
                    autoCapitalize='none' />
                
                <TouchableHighlight
                    // style={style.touchbutton}
                    style={
                      {
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        borderBottomLeftRadius: 15,
                        borderBottomRightRadius: 15,
                        borderWidth: 1,
                        borderColor: '#039BE5',
                        backgroundColor: '#039BE5',
                        padding:15,
                        position:'absolute', 
                        top:420,
                        alignSelf:'center',
                        width:'88%'
                      }
                    }
                    // onPress={()=> this.props.navigation.navigate('Home')} 
                >
                    <Text style={style.touchbuttonlabel}>Login</Text>
                </TouchableHighlight>

                {/* <TouchableHighlight
                    style={style.touchbutton}
                    onPress={() => this.signInWithGoogleAsync()} >
                    <Text style={style.touchbuttonlabel}>Sign in with Google</Text>
                </TouchableHighlight> */}


                <Text
                  style={
                    {
                      alignSelf:'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'absolute',
                      top: 490, left:0, bottom: 0, right: 0,
                      fontSize: 16
                    }
                  }
                  >
                    Forgot password
                </Text>
                
                <Text
                  style={
                    {
                      alignSelf:'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'absolute',
                      top: 560, left:0, bottom: 0, right: 0,
                      fontSize: 16
                    }
                  }
                  >
                    ~ or connect with ~
                </Text>


                <FontAwesome 
                  name="google-plus-official" 
                  size={77} 
                  color="#d34836" 
                  style={{position:'absolute',top:600,left:130,alignSelf:'flex-start'}}
                  onPress={() => this.signInWithGoogleAsync()}
                  />

                <FontAwesome5 
                  name="facebook" 
                  size={70} 
                  color="#4267B2" 
                  style={{position:'absolute',top:600,right:130}}
                  />


                <Text
                  style={
                    {
                      alignSelf:'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'absolute',
                      top: 750, left:0, bottom: 0, right: 0,
                      fontSize: 16
                    }
                  }
                  >
                    Don't have an account? Sign up here
                </Text>

                {/* <TouchableHighlight
                    style={style.touchbutton}
                    onPress={()=>this.fbLogIn()}
                    >
                    <Text style={style.touchbuttonlabel}>Login in with Facebook</Text>
                </TouchableHighlight> */}

                {/* // <Text>No account yet?</Text>

                // <TouchableHighlight
                //     onPress={()=>this.props.navigation.navigate('Signup')} >
                //     <Text>Sign up</Text>
                // </TouchableHighlight>  */}

            </View>
        )
    }

}

const style = StyleSheet.create({

    background:{
        backgroundColor: '#B3E5FC',
        flex: 1
    },

    textinput:{
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#FAFAFA',
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 10,
        padding:10,
        textAlign: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        position: 'relative',
        top: -40
    },

    touchbutton: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderWidth: 1,
        borderColor: '#039BE5',
        backgroundColor: '#039BE5',
        marginLeft: 25,
        marginRight: 25,
        padding:15,
        marginTop: 25
    },

    touchbuttonlabel:{
        textAlign: 'center',
        color: 'white'
    }

});
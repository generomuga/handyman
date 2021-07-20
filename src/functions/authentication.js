import React, { Component } from "react";

import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';

class Authentication extends Component {

    // constructor(props){
    //     super(props)
    // }

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

    isLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            
            if (user) {
                const user = firebase.auth().currentUser;
                    if (user !== null) {
                    
                    const emailVerified = user.emailVerified;
                    
                    console.log('ngang'+emailVerified);

                    if (emailVerified === true) {
                        // this.props.navigation.navigate('Home')
                        console.log('YES');
                        return true;
                    }
                    else {
                        //  this.props.navigation.navigate('Login')
                        console.log('No');
                        return false;
                        // this.setState({errorMsg: '* Please verify your account through your email'})
                    }
                }

            }
            else {
                // this.props.navigation.navigate('Login')
            }

        }

    )}

    login = async() => {
        try {
          await Facebook.initializeAsync({
            appId: '491440875477602',
          });
          const {
            type,
            token,
            expirationDate,
            permissions,
            declinedPermissions,
          } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile'],
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
    }

    fbLogIn = async() => {
        
        let appIds = '491440875477602';

        try {
            await Facebook.initializeAsync({appId:appIds});
            const {
              type,
              token,
              expirationDate,
              permissions,
              declinedPermissions,
              appId, 
            } = await Facebook.logInWithReadPermissionsAsync({
              permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
                console.log(appId);

                const credential = firebase.auth.FacebookAuthProvider.credential(token)
        
                firebase.auth().signInWithCredential(credential).catch((error) => {
                    console.log(error)
                }
                )
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

}

const authentication = new Authentication();
export default authentication;
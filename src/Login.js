import React, { useState, useEffect } from "react";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";

import {
  Image,
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Spinner from "react-native-loading-spinner-overlay";

import * as Google from "expo-google-app-auth";

import { Background, Button, Input, Label } from "./styles";

import validation from "./functions/validation";
import database from "./functions/database";
import authentication from "./functions/authentication";

import { FontAwesome5, FontAwesome } from "@expo/vector-icons";

import * as firebase from "firebase";

import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { Alert } from "react-native";

database.init();

export default function Login(props) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isAppleLoginAvailable, setIsAppleLoginAvailable] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      checkIfLoggedIn();
      AppleAuthentication.isAvailableAsync().then(setIsAppleLoginAvailable);
    }
    return () => (isSubscribed = false);
  }, []);

  const checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const user = firebase.auth().currentUser;

        if (user !== null) {
          isUserExists(user);

          if (user.emailVerified || user.phoneNumber) {
            setIsLoading(false);
            clearState();
            props.navigation.navigate("Home");
          } else {
            setErrorMessage("* Please verify your account through your email");
            props.navigation.navigate("Login");
          }
        }
      } else {
        props.navigation.navigate("Login");
      }
    });
  };

  const isUserExists = (user) => {
    const dbRef = firebase.database().ref();

    dbRef
      .child("users")
      .child(user["uid"])
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
        } else {
          registerUser(user);
        }
      });
  };

  const registerUser = (user) => {
    let signInMethod = "";
    if (user.emailVerified) {
      signInMethod = "email";
    } else if (user.phoneNumber) {
      signInMethod = "phone";
    } else {
      signInMethod = "email";
    }

    firebase
      .database()
      .ref("users/" + user["uid"])
      .set({
        displayName: user["displayName"] ? user["displayName"] : "",
        gender: user["gender"] ? user["gender"] : "",
        email: user["email"] ? user["email"] : "",
        emailVerified: user["emailVerified"],
        photoURL: user["photoURL"] ? user["photoURL"] : "",
        contactNo: user["phoneNumber"] ? user["phoneNumber"] : "",
        address: user["address"] ? user["address"] : "",
        signInMethod: signInMethod,
        isAdmin: false,
      });
  };

  const signInWithGoogleAsync = async () => {
    try {
      setIsLoading(true);
      const result = await Google.logInAsync({
        androidClientId: ANDROID_CLIENT_ID,
        androidStandaloneAppClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        scopes: ["profile", "email"],
      });
      if (result.type === "success") {
        onSignIn(result);
        return result.accessToken;
      } else {
        setIsLoading(false);
        return { cancelled: true };
      }
    } catch (e) {
      setIsLoading(false);
      alert(e);
      return { error: true };
    }
  };

  const onSignIn = (googleUser) => {
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
        firebase
          .auth()
          .signInWithCredential(credential)
          .catch((error) => {
            console.log(error);
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
      }
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User logged in already or has just logged in.
        //   this.registerUser(user['uid'], user['displayName'], user['email']);
      } else {
        // User not logged in or has just logged out.
      }
    });
  };

  const isUserEqualGoogle = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const onLogin = ({ email, password }) => {
    setErrorMessage("");

    const [resultIsEmailEmpty, messageIsEmailEmpty] =
      validation.isEmailEmpty(email);
    if (resultIsEmailEmpty === true) {
      setErrorMessage(messageIsEmailEmpty);
      return;
    }

    const [resultIsEmailInvalid, messageIsEmailInvalid] =
      validation.isEmailInvalid(email);
    if (resultIsEmailInvalid === true) {
      setErrorMessage(messageIsEmailInvalid);
      return;
    }

    const [resultIsPasswordEmpty, messageIsPasswordEmpty] =
      validation.isPasswordEmpty(password);
    if (resultIsPasswordEmpty === true) {
      setErrorMessage(messageIsPasswordEmpty);
      return;
    }

    setIsLoading(true);

    // TODO: Put it in authentication class
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const emailVerified = user.emailVerified;

        if (emailVerified === true) {
          // Do nothing
          setIsLoading(false);
          props.navigation.navigate("Home");
          clearState();
        } else {
          setIsLoading(false);
          setErrorMessage("Please verify your account through your email");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage("Your email or password is incorrect.");
      });
  };

  const clearState = () => {
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  const signInWithApple = () => {
    const nonce = Math.random().toString(36).substring(2, 10);

    setIsLoading(true);
    return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
        .then((hashedNonce) =>
            AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ],
                nonce: hashedNonce
            })
        )
        .then((appleCredential) => {
            const { identityToken } = appleCredential;
            const provider = new firebase.auth.OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: identityToken,
                rawNonce: nonce
            });
            console.log(credential);
            return firebase.auth().signInWithCredential(credential).then((res)=>{
              setIsLoading(false);
            });
            // Successful sign in is handled by firebase.auth().onAuthStateChanged
        })
        .catch((error) => {
            // ...
            console.log(error)
        });
};

const loginWithApple = async () => {
  const csrf = Math.random().toString(36).substring(2, 15);
  const nonce = Math.random().toString(36).substring(2, 10);
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256, nonce);
  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL
    ],
    state: csrf,
    nonce: hashedNonce
  });
  const { identityToken, email, state } = appleCredential;

  if (identityToken) {
    const provider = new firebase.auth.OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: nonce // nonce value from above
    });
    console.log("Credential",credential)
    await firebase.auth().signInWithCredential(credential).then(()=>{
      console.log("Success")
    }).catch(()=>{
      console.log("Error")
    });
  }
}

  return (
    <SafeAreaView style={style.background}>
      <Spinner
        visible={isLoading}
        textContent={"Loading..."}
        textStyle={style.spinnerTextStyle}
      />

      <View style={style.viewLogo}>
        <Image
          source={require("../assets/hugefort-ico.png")}
          style={style.logo}
        />
      </View>

      <View style={style.viewTextInput}>
        <TextInput
          style={style.textInput}
          placeholder="email"
          autoCapitalize="none"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />

        <TextInput
          style={style.textInput}
          placeholder="password"
          secureTextEntry={true}
          autoCapitalize="none"
          value={password}
          onChangeText={(password) => setPassword(password)}
        />

        <Text style={style.labelErrorMessage}>{errorMessage}</Text>

        <TouchableOpacity
          style={[style.button, { marginBottom: 20 }]}
          onPress={() => onLogin({ email, password })}
        >
          <Text style={style.touchButtonLabel}>Login</Text>
        </TouchableOpacity>

        <Text
          style={style.forgotPassword}
          onPress={() => props.navigation.navigate("ForgotPassword")}
        >
          Forgot password
        </Text>
      </View>

      <View style={style.viewSocialMedia}>
        <Text style={style.connect}>~ or connect with ~</Text>

        <View style={style.viewGoogleFb}>
          <FontAwesome5
            name="google-plus-square"
            size={68}
            color="#d34836"
            style={style.google}
            onPress={() => signInWithGoogleAsync()}
          />

          <FontAwesome5
            name="phone-square"
            size={68}
            style={style.phone}
            color="green"
            onPress={() => {
              setIsLoading(true);
              props.navigation.navigate("PhoneSignIn");
              setIsLoading(false);
            }}
          />
        </View>


        <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={5}
                style={{ width: 200, height: 44, alignSelf:'center' }}
                onPress={()=>{
                  signInWithApple();
                  }
                }
                // onPress={loginWithApple}
              />
        <Text
          style={style.signUp}
          onPress={() => props.navigation.navigate("Signup")}
        >
          Don't have an account? Sign up here
        </Text>

        <Text
          style={style.walkthrough}
          onPress={() => {
            props.navigation.navigate("Walkthrough");
          }}
        >
          See our Walkthrough
        </Text>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  background: {
    ...Background.blue,
    ...Background.fullscreen,
    ...Background.center_content,
  },

  button: {
    ...Button.standard,
    marginLeft: '10%',
    marginRight: '10%',
  },

  viewLogo: {
    flex: 1,
  },

  logo: {
    width: '70%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  viewTextInput: {
    flex: 1,
    ...Background.center_content,
  },

  textInput: {
    ...Input.border,
    ...Input.padding,
    ...Input.color,
    ...Input.text_alignment,
    ...Input.side_margin,
    marginBottom: 10,
  },

  labelErrorMessage: {
    ...Label.self_alignment,
    ...Label.text_alignment,
    ...Label.weight,
    ...Label.red,
    marginBottom: 10,
  },

  touchButton: {
    ...Button.border,
    ...Button.color,
    ...Button.padding,
    ...Button.alignment,
    ...Button.side_margin,
    marginBottom: 20,
  },

  touchButtonLabel: {
    ...Button.label,
  },

  forgotPassword: {
    ...Label.self_alignment,
    ...Label.text_alignment,
    ...Label.weight,
    marginBottom: '15%',
  },

  viewSocialMedia: {
    flex: 1,
    ...Background.center_content,
  },

  connect: {
    ...Label.self_alignment,
    ...Label.text_alignment,
    ...Label.weight,
  },

  viewGoogleFb: {
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "center",
  },

  google: {
    alignSelf: "center",
    margin: 10,
  },

  phone: {
    alignSelf: "center",
    margin: 10,
  },

  facebook: {
    alignSelf: "center",
    margin: 10,
  },

  signUp: {
    ...Label.self_alignment,
    ...Label.text_alignment,
    ...Label.weight,
    marginTop: 10,
  },

  spinnerTextStyle: {
    color: "#FFF",
  },

  walkthrough: {
    ...Label.self_alignment,
    ...Label.text_alignment,
    fontWeight: "bold",
    color: "#01579B",
    marginTop: '5%',
    marginBottom: 20,
    fontSize: 17,
  },
});

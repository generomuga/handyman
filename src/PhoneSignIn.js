import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  // Button,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';

import {  
  Button
} from './styles';

import validation from './functions/validation';

import { firebaseConfig } from '../src/config/config';

import database from './functions/database';

database.init();

export default function PhoneSignIn(props) {
  
  const recaptchaVerifier = useRef(null);

  const [
    phoneNumber, 
    setPhoneNumber
  ] = useState();

  const [
    verificationId, 
    setVerificationId
  ] = useState();

  const [
    verificationCode, 
    setVerificationCode
  ] = useState();

  const [
    message, 
    showMessage
  ] = useState();

  const [
      errorMessage,
      setErrorMessage
  ] = useState('');

  const attemptInvisibleVerification = false;

  return (

    <SafeAreaView
      style={{flex:1, backgroundColor:'white'}}>

      <View style={{ padding: 20, marginTop: 50 }}>
        
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={attemptInvisibleVerification}
        />
        
        <Text style={{ marginTop: 20 }}>Enter phone number</Text>

        <TextInput
          style={{ marginVertical: 10, fontSize: 17 }}
          placeholder="+63 (10 digit number)"
          autoFocus
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
        />

        {/* <Button
          title="Send Verification Code"
          disabled={!phoneNumber}
          onPress={async () => {
            try {
              const phoneProvider = new firebase.auth.PhoneAuthProvider();
              const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
              );
              setVerificationId(verificationId);
              showMessage({
                text: 'Verification code has been sent to your phone.',
              });
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: 'red' });
            }
          }}
        /> */}

        <TouchableOpacity 
          style={style.button} 
          disabled={!phoneNumber}
          onPress={async () => {
            try {
              const phoneProvider = new firebase.auth.PhoneAuthProvider();
              const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
              );
              setVerificationId(verificationId);
              showMessage({
                text: 'Verification code has been sent to your phone.',
              });
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: 'red' });
            }
          }} >
          <Text
                style={{
                    color:'white',
                    textAlign:'center'
                }}
                >Send verification code</Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 20 }}>Enter Verification code</Text>

        <TextInput
          style={{ marginVertical: 10, fontSize: 17 }}
          editable={!!verificationId}
          placeholder="123456"
          onChangeText={setVerificationCode}
        />

        {/* <Button
          title="Confirm Verification Code"
          disabled={!verificationId}
          onPress={async () => {
            try {
              const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              );
              await firebase.auth().signInWithCredential(credential)
                .then(()=>{
                  props.navigation.navigate('Login')
                })
                .catch((error) => {
                  console.log(error)
                })
              ;
              showMessage({ text: 'Phone authentication successful 👍' });
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: 'red' });
            }
          }}
        /> */}

        <TouchableOpacity 
          style={style.button} 
          disabled={!verificationId}
          onPress={async () => {
            try {
              const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              );
              await firebase.auth().signInWithCredential(credential)
                .then(()=>{
                  props.navigation.navigate('Login')
                })
                .catch((error) => {
                  console.log(error)
                })
              ;
              showMessage({ text: 'Phone authentication successful 👍' });
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: 'red' });
            }
          }} >
          <Text
                style={{
                    color:'white',
                    textAlign:'center'
                }}
                >Confirm verification code</Text>
        </TouchableOpacity>

        {message ? (
          <TouchableOpacity
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 0xffffffee, justifyContent: 'center' },
            ]}
            onPress={() => showMessage(undefined)}>
            <Text
              style={{
                color: message.color || 'blue',
                fontSize: 17,
                textAlign: 'center',
                margin: 20,
              }}>
              {message.text}
            </Text>
          </TouchableOpacity>
        ) : (
          undefined
        )}
        {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      </View>

    </SafeAreaView>
  );
}


const style = StyleSheet.create({

  button: {
      ...Button.standard
  },

})
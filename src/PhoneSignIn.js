import React, { useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  // Button,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import * as firebase from "firebase";

import { Button, Input, Label } from "./styles";

import Spinner from "react-native-loading-spinner-overlay";

import validation from "./functions/validation";

import { firebaseConfig } from "../src/config/config";
import database from "./functions/database";

database.init();

export default function PhoneSignIn(props) {
  const recaptchaVerifier = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState("");

  const [verificationId, setVerificationId] = useState();

  const [verificationCode, setVerificationCode] = useState();

  const [message, showMessage] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const attemptInvisibleVerification = false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#B3E5FC" }}>
      <Spinner
        visible={isLoading}
        textContent={"Loading..."}
        textStyle={style.spinnerTextStyle}
      />

      <View style={{ padding: 20, marginTop: 50 }}>
        <Text style={style.labelErrorMessage}>{errorMessage}</Text>

        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
          attemptInvisibleVerification={attemptInvisibleVerification}
        />

        <Text style={style.label}>Enter phone number</Text>

        <TextInput
          style={style.textInput}
          placeholder="+63 (10 digit number)"
          autoFocus
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
        />

        <TouchableOpacity
          style={style.button}
          onPress={async () => {
            try {
              setErrorMessage("");

              const [resultIsPhoneNumberEmpty, messageIsPhoneNumberEmpty] =
                validation.isPhoneNumberEmpty(phoneNumber);
              if (resultIsPhoneNumberEmpty === true) {
                setErrorMessage(messageIsPhoneNumberEmpty);
                return;
              }

              const [resultIsPhoneNumberInvalid, messageIsPhoneNumberInvalid] =
                validation.isPhoneNumberInvalid(phoneNumber);
              if (resultIsPhoneNumberInvalid === true) {
                setErrorMessage(messageIsPhoneNumberInvalid);
                return;
              }

              const phoneProvider = new firebase.auth.PhoneAuthProvider();
              const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
              );
              setVerificationId(verificationId);
              showMessage({
                text: "Verification code has been sent to your phone.",
              });
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: "red" });
            }
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            Send verification code
          </Text>
        </TouchableOpacity>

        <Text style={style.label}>Enter Verification code</Text>

        <TextInput
          style={style.textInput}
          editable={!!verificationId}
          placeholder="123456"
          onChangeText={setVerificationCode}
        />

        <TouchableOpacity
          style={[
            style.button,
            { backgroundColor: verificationId ? "#039BE5" : "gray" },
          ]}
          disabled={!verificationId}
          onPress={async () => {
            try {
              setIsLoading(true);
              const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              );
              await firebase
                .auth()
                .signInWithCredential(credential)
                .then(() => {
                  props.navigation.navigate("Login");
                })
                .catch((error) => {});
            } catch (err) {
              showMessage({ text: `Error: ${err.message}`, color: "red" });
            }
            setIsLoading(false);
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            Confirm verification code
          </Text>
        </TouchableOpacity>

        {message ? (
          <TouchableOpacity
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "#E3F2FD", justifyContent: "center" },
            ]}
            onPress={() => showMessage(undefined)}
          >
            <Text
              style={{
                color: message.color || "#0D47A1",
                fontSize: 17,
                textAlign: "center",
                margin: 20,
              }}
            >
              {message.text}
            </Text>
          </TouchableOpacity>
        ) : undefined}
        {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  button: {
    ...Button.standard,
  },

  textInput: {
    ...Input.border,
    ...Input.padding,
    ...Input.color,
    ...Input.text_alignment,
    marginBottom: 15,
  },

  label: {
    textAlign: "left",
    fontWeight: "300",
    fontSize: 17,
    marginBottom: 15,
    marginTop: 15,
  },

  labelErrorMessage: {
    ...Label.self_alignment,
    ...Label.text_alignment,
    ...Label.weight,
    ...Label.red,
  },

  spinnerTextStyle: {
    color: "#FFF",
  },
});

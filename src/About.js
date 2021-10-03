import React, { useState, useEffect } from "react";

import { View, Text, Image } from "react-native";

import * as firebase from "firebase";

import Anchor from "./Anchor";

const dbRef = firebase.database().ref();

export default function About({ navigation }) {
  const [companyProfile, setCompanyProfile] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCompanyProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const getCompanyProfile = () => {
    let companyProfile = "";

    dbRef
      .child("tenant/company")
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          companyProfile = snapshot.val()["profile"];
        }
        setCompanyProfile(companyProfile);
      });
  };

  return (
    <View
      style={{
        backgroundColor: "#E3F2FD",
        flex: 1,
      }}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: 300,
            height: 100,
            marginTop: 10,
            marginBottom: 10,
          }}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ftlogo.png?alt=media&token=0cf81f7b-cc30-4ab5-ba34-f791d624c7cc",
          }}
        />
      </View>

      <View>
        <Text
          style={{
            textAlign: "justify",
            alignContent: "center",
            marginLeft: 15,
            marginRight: 15,
            marginTop: 10,
            marginBottom: 25,
            fontSize: 14,
            fontWeight: "500",
            color: "#424242",
          }}
        >
          {companyProfile}
        </Text>
      </View>

      <View
        style={{
          alignSelf: "center",
          marginBottom: 5,
        }}
      >
        <Anchor href="https://handyman-plus.web.app/terms-and-condition">
          <Text style={{ fontSize: 15 }}>Terms and Conditions </Text>
        </Anchor>
      </View>

      <View
        style={{
          alignSelf: "center",
          marginBottom: 5,
        }}
      >
        <Anchor href="https://handyman-plus.web.app/privacy-policy">
          <Text style={{ fontSize: 15 }}>Privacy Policy</Text>
        </Anchor>
      </View>

      <View
        style={{
          alignSelf: "center",
        }}
      >
        <Anchor href="https://handyman-plus.web.app/privacy-policy">
          <Text style={{ fontSize: 15 }}>Repair and Maintenance Agreement</Text>
        </Anchor>
      </View>
    </View>
  );
}
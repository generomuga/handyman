import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";

import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input-view";

export default function CreditCard({ navigation, route }) {
  useEffect(() => {}, []);

  const _onChange = (form) => console.log(form);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 20, flex: 0.2 }}>
        <Text>Payment</Text>
        <Text>AMOUNT{route.params.amount}</Text>
      </View>
      <View
        style={{
          flex: 0.6,
          marginTop: 120,
        }}
      >
        <CreditCardInput onChange={(form) => console.log(form)} />
      </View>
      <View style={{ flex: 0.1 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const style = StyleSheet.create({});

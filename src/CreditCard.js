import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";

import { Button, Label } from "./styles";

import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input-view";

export default function CreditCard({ navigation, route }) {
  const [creditCardInfo, setCreditCardInfo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addZeros = (totalServicePrice) => {
    return parseInt(totalServicePrice + "00");
  };

  const createPaymentMethod = async () => {
    try {
      setErrorMessage("");
      let isValid = creditCardInfo["valid"];

      if (isValid != false) {
        let amount = addZeros(route.params.amount);

        let card_no = creditCardInfo["values"]["number"]
          .replace(/\s+/g, "")
          .trim();
        let cvc = creditCardInfo["values"]["cvc"];
        let expiry = creditCardInfo["values"]["expiry"].split("/");
        let month = parseInt(expiry[0]);
        let year = parseInt("20" + expiry[1]);

        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic c2tfdGVzdF9GNjlYb0U0UTI2WlZUZ0NNWlNpWmpSeEw6",
          },
          body: JSON.stringify({
            data: {
              attributes: {
                details: {
                  card_number: card_no,
                  exp_month: month,
                  exp_year: year,
                  cvc: cvc,
                },
                type: "card",
              },
            },
          }),
        };

        await fetch("https://api.paymongo.com/v1/payment_methods", options)
          .then((response) => response.json())
          .then((response) => {
            let paymentMethodId = response["data"]["id"];
            const options = {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  "Basic c2tfdGVzdF9GNjlYb0U0UTI2WlZUZ0NNWlNpWmpSeEw6",
              },
              body: JSON.stringify({
                data: {
                  attributes: {
                    amount: amount,
                    payment_method_allowed: ["card"],
                    payment_method_options: {
                      card: { request_three_d_secure: "any" },
                    },
                    currency: "PHP",
                  },
                },
              }),
            };

            fetch("https://api.paymongo.com/v1/payment_intents", options)
              .then((response) => response.json())
              .then((response) => {
                let paymentIntentId = response["data"]["id"];
                const options = {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization:
                      "Basic c2tfdGVzdF9GNjlYb0U0UTI2WlZUZ0NNWlNpWmpSeEw6",
                  },
                  body: JSON.stringify({
                    data: {
                      attributes: {
                        payment_method: paymentMethodId,
                      },
                    },
                  }),
                };

                fetch(
                  "https://api.paymongo.com/v1/payment_intents/" +
                    paymentIntentId +
                    "/attach",
                  options
                )
                  .then((response) => response.json())
                  .then((response) => {
                    let status = response["data"]["attributes"]["status"];

                    // navigation.navigate("Home", { status: "test" });
                    navigation.navigate("Home", {
                      screen: "Book",
                      params: { status: status },
                    });
                    // null;
                  })
                  .catch((err) => console.error(err));
              })
              .catch((err) => {
                setErrorMessage("Please enter a valid card info");
              });
          })
          .catch((err) => console.error(err));
      } else {
        setErrorMessage("Please enter a valid card info");
      }
    } catch (error) {
    } finally {
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          marginTop: 70,
          flex: 0.2,
          // backgroundColor: "#EDE7F6",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 17,
            alignSelf: "center",
            textAlign: "center",
            marginLeft: 30,
            marginBottom: 80,
          }}
        >
          Card Information
        </Text>
        {/* <Text>AMOUNT{route.params.amount}</Text> */}
      </View>
      <View
        style={{
          flex: 0.4,
          marginTop: 20,
          // backgroundColor: "#E3F2FD",
        }}
      >
        <CreditCardInput
          onChange={(form) => {
            setCreditCardInfo(form);
          }}
        />
      </View>
      <View>
        <Text style={style.labelErrorMessage}>{errorMessage}</Text>
      </View>
      <View style={{ flex: 0.1, marginBottom: 10 }}>
        <TouchableOpacity
          style={[style.button]}
          onPress={() => {
            createPaymentMethod();
          }}
        >
          <Text style={style.touchButtonLabel}>
            Pay Php {route.params.amount}.00
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 0.1 }}>
        <TouchableOpacity
          style={[style.button, { backgroundColor: "#E65100" }]}
          onPress={() => {
            navigation.navigate("Home", {
              screen: "Book",
              params: { status: "failed" },
            });
          }}
        >
          <Text style={style.touchButtonLabel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  button: {
    ...Button.standard,
    marginLeft: 40,
    marginRight: 40,
  },

  touchButtonLabel: {
    ...Button.label,
  },

  labelErrorMessage: {
    ...Label.self_alignment,
    ...Label.text_alignment,
    ...Label.weight,
    ...Label.red,
    marginBottom: 10,
  },
});

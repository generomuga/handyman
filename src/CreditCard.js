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

  const [creditCardInfo, setCreditCardInfo] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // const _onChange = (form) => console.log(form);
  const addZeros = (totalServicePrice) => {
    return parseInt(totalServicePrice + "00");
  };

  const createPaymentMethod = async () => {
    try {
      setErrorMessage("");
      let isValid = creditCardInfo["valid"];
      console.log(isValid);
      if (isValid != false) {
        let amount = addZeros(route.params.amount);
        console.log(creditCardInfo);

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
            let pid = response["data"]["id"];
            console.log(pid);
            setPaymentMethodId(pid);
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
                // console.log(response);
                let piid = response["data"]["id"];
                setPaymentIntentId(piid);

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
                    console.log(response);
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
        console.log("Not valid");
        setErrorMessage("Please enter a valid card info");
      }
    } catch (error) {
    } finally {
    }
  };

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
        <CreditCardInput
          onChange={(form) => {
            setCreditCardInfo(form);
            // console.log(form);
          }}
        />
      </View>
      <View>
        <Text>{errorMessage}</Text>
      </View>
      <View style={{ flex: 0.1 }}>
        <TouchableOpacity
          onPress={() => {
            // console.log(creditCardInfo);
            // navigation.goBack();
            // console.log(route.params.amount);
            createPaymentMethod();
          }}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const style = StyleSheet.create({});

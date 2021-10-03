import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-navigation";
import { Background, Button, Input, Label } from "./styles";
import ToggleSwitch from "toggle-switch-react-native";
import Anchor from "./Anchor";

export default function Review(props) {
  const [isAgree, setIsAgree] = useState(false);

  return (
    <SafeAreaView style={style.background}>
      <View style={style.viewLogo}>
        <Image
          source={require("../assets/hugefort-ico.png")}
          style={style.logo}
        />
      </View>

      <View style={style.viewTermsAndCondition}>
        <View>
          <View>
            <Anchor href="https://handyman-plus.web.app/terms-and-condition">
              <Text style={{ fontSize: 17 }}>
                Agree on Terms and Conditions{" "}
              </Text>
            </Anchor>
          </View>
        </View>
      </View>

      <View style={style.viewTermsAndCondition}>
        <View>
          <View>
            <Anchor href="https://handyman-plus.web.app/privacy-policy">
              <Text style={{ fontSize: 17 }}>Privacy Policy </Text>
            </Anchor>
          </View>
        </View>
      </View>

      <View style={style.viewTermsAndCondition}>
        <View>
          <View>
            <Anchor href="https://handyman-plus.web.app/privacy-policy">
              <Text style={{ fontSize: 17 }}>
                Repair and Maintenance Agreement{" "}
              </Text>
            </Anchor>
          </View>
        </View>
      </View>

      <View style={style.viewAgree}>
        <View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              I agree to the conditions, policy and agreement{" "}
            </Text>
          </View>
        </View>

        <ToggleSwitch
          isOn={isAgree}
          onColor="green"
          offColor="red"
          size="small"
          label=""
          labelStyle={{
            fontSize: 12,
          }}
          onToggle={() => {
            if (isAgree === true) {
              setIsAgree(false);
            } else {
              setIsAgree(true);
            }
          }}
        />
      </View>

      <View style={{ marginTop: 50, marginLeft: 40, marginRight: 40 }}>
        <TouchableOpacity
          style={[
            style.button,
            { backgroundColor: isAgree ? "#039BE5" : "#DD2C00" },
          ]}
          onPress={() => props.navigation.navigate("Login")}
          disabled={!isAgree}
        >
          <Text style={style.touchButtonLabel}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  background: {
    ...Background.blue,
    ...Background.fullscreen,
  },

  viewLogo: {
    flex: 0.3,
    justifyContent: "center",
    marginTop: "30%",
    marginBottom: 50,
  },

  logo: {
    width: 400,
    height: 300,
    alignSelf: "center",
  },

  viewTermsAndCondition: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 5,
  },

  viewAgree: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 60,
  },

  button: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderWidth: 1,
    borderColor: "#039BE5",
    // backgroundColor: "#039BE5",
    padding: 15,
    alignSelf: "stretch",
  },

  touchButtonLabel: {
    ...Button.label,
  },
});

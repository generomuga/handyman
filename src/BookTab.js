import React, { useEffect, useState } from "react";

import { CheckBox } from "react-native-elements";

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";

import { Button, Input, Label } from "./styles";

import { MaterialIcons } from "@expo/vector-icons";

import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "react-native-modal-datetime-picker";
import ToggleSwitch from "toggle-switch-react-native";

import { AntDesign } from "@expo/vector-icons";

import Anchor from "./Anchor";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["Unhandled Promise Rejection"]);
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

import * as firebase from "firebase";

import { TextInput } from "react-native-gesture-handler";
import Dialog from "react-native-dialog";

import * as WebBrowser from "expo-web-browser";

const dbRef = firebase.database().ref();

export default function BookTab({ navigation, route }) {
  const [errorMessage, setErrorMessage] = useState("");

  const [categoryCurrentValue, setCategoryCurrentValue] = useState("");

  const [serviceCurrentValue, setServiceCurrentValue] = useState("");

  const [categories, setCategories] = useState([]);

  const [services, setServices] = useState([]);

  const [serviceCurrency, setServiceCurrency] = useState("");

  const [servicePrice, setServicePrice] = useState(0);

  const [actualDate, setActualDate] = useState("");

  const [serviceDateCurrentValue, setServiceDateCurrentValue] = useState("");

  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState();

  const [isUseDefaultAddress, setIsUseDefaultAddress] = useState(false);

  const [isAddressEditable, setIsAddressEditable] = useState(true);

  const [displayName, setDisplayName] = useState("");

  const [gender, setGender] = useState("");

  const [email, setEmail] = useState("");

  const [contactNo, setContactNo] = useState("");

  const [address, setAddress] = useState("");

  const [photoURL, setPhotoURL] = useState("");

  const [isUseDefaultContactNo, setIsUseDefaultContactNo] = useState(false);

  const [isContactNoEditable, setIsContactNoEditable] = useState(true);

  const [isVisible, setIsVisible] = useState(true);

  const [isBooked, setIsBooked] = useState(false);

  const [isServiceAdded, setIsServiceAdded] = useState(true);

  const [status, setStatus] = useState("Pending");

  const [serviceInfo, setServiceInfo] = useState([]);

  const [totalServicePrice, setTotalServicePrice] = useState([]);

  const [totalReserveService, setTotalReserveService] = useState(0);

  const [paymentMethodValue, setPaymentMethodValue] = useState("");

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const [isDoneDialogVisible, setIsDoneDialogVisible] = useState(false);

  const [isAddServiceDisabled, setIsAddServiceDisabled] = useState(true);

  const [isAddBookItNowDisabled, setIsAddBookItNowDisabled] = useState(true);

  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  const [isAgree, setIsAgree] = useState(false);

  const [paymentURL, setPaymentURL] = useState("");

  const [sourceId, setSourceId] = useState("");

  const [type, setType] = useState("");

  const [paymentId, setPaymentId] = useState("");

  const [paymentIcon, setPaymentIcon] = useState(
    require("../assets/" + "Default" + ".png")
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCategoryList();
      getServiceInfo();
      getUserInfo();
      if (route.params !== undefined) {
        setIsAddBookItNowDisabled(false);
        console.log("True");
      } else {
        setIsAddBookItNowDisabled(true);
        console.log("False");
      }
    });

    return unsubscribe;
  }, [navigation, route]);

  const getCategoryList = () => {
    const items = [];

    dbRef
      .child("tenant/categories")
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach(function (childsnap) {
            var data = childsnap.val();
            items.push({
              label: data,
              value: data,
              key: data,
            });
          });
          setCategories(items);
        }
      });
  };

  const getServiceList = (category) => {
    let items = [];
    let price = 0;
    let currency = "Php";
    let isAvailable = false;
    let name = "";

    dbRef
      .child("tenant/services/" + category + "/")
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach(function (childsnap) {
            name = childsnap.val()["name"];
            price = childsnap.val()["price"];
            currency = childsnap.val()["currency"];
            isAvailable = childsnap.val()["isAvailable"];

            if (isAvailable === true) {
              items.push({
                label: name,
                value: name,
                key: name,
              });
            }
          });

          setServices(items);
          setServiceCurrency(currency);
          setServicePrice(price);
        }
      })
      .catch((error) => {});
  };

  const getServiceInfo = () => {
    let user = firebase.auth().currentUser;

    let items = [];
    let id = "";
    let category = "";
    let service = "";
    let service_date = "";
    let service_price = 0;
    let service_currency = "";
    let address = "";
    let totalPrice = 0;
    let totalReserveService = 0;
    let contact_no = "";
    let is_visible = false;
    let is_booked = false;
    let is_service_added = true;
    let status = "";

    dbRef
      .child("bookings/" + user["uid"])
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach(function (childsnap) {
            id = childsnap.val()["id"];
            category = childsnap.val()["category"];
            service = childsnap.val()["service"];
            service_date = childsnap.val()["service_date"];
            service_price = childsnap.val()["service_price"];
            service_currency = childsnap.val()["service_currency"];
            address = childsnap.val()["address"];
            contact_no = childsnap.val()["contact_no"];
            is_visible = childsnap.val()["is_visible"];
            is_booked = childsnap.val()["is_booked"];
            is_service_added = childsnap.val()["is_service_added"];
            status = childsnap.val()["status"];

            if (
              is_visible === true &&
              is_booked === false &&
              is_service_added === true
            ) {
              totalPrice = totalPrice + service_price;
              totalReserveService = totalReserveService + 1;
            }

            if (is_visible === true && is_booked === false) {
              items.push({
                id,
                category,
                service,
                service_date,
                service_price,
                service_currency,
                address,
                contact_no,
                is_visible,
                is_service_added,
              });
            }
          });

          setServiceInfo(items);
          setTotalServicePrice(totalPrice);
          setTotalReserveService(totalReserveService);
        } else {
          setServiceInfo([]);
          setTotalServicePrice(0);
          setTotalReserveService(0);
        }
      });
  };

  const getUserInfo = () => {
    setErrorMessage("");

    let user = firebase.auth().currentUser;
    let displayName = "";
    let address = "";
    let contactNo = "";
    let email = "";
    let photoURL = "";

    dbRef
      .child("users")
      .child(user["uid"])
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          displayName = snapshot.val()["displayName"];
          email = snapshot.val()["email"];
          address = snapshot.val()["address"];
          contactNo = snapshot.val()["contactNo"];
          photoURL = snapshot.val()["photoURL"];

          if (
            displayName.length < 1 ||
            email.length < 1 ||
            address.length < 1 ||
            contactNo.length < 1
          ) {
            setIsAddServiceDisabled(true);
            setIsAddBookItNowDisabled(true);
            setErrorMessage("Please complete your profile info");
            return;
          }

          setIsAddServiceDisabled(false);
          setIsAddBookItNowDisabled(false);
          setDisplayName(displayName);
          setEmail(email);
          setGender(gender);
          setAddress(address);
          setContactNo(contactNo);
          setPhotoURL(photoURL);
        }
      });
  };

  const updateBookingDetails = () => {
    let user = firebase.auth().currentUser;
    let uid = user["uid"];

    let id = "";
    let category = "";
    let service = "";
    let service_date = "";
    let service_price = 0;
    let service_currency = "";
    let contact_no = "";
    let status = "Pending";
    let address = "";
    let is_visible = false;
    let is_service_added = false;

    let trasaction_id = new Date().getTime().toString();
    let transactionRef = dbRef
      .child("transactions/" + uid)
      .child(trasaction_id);
    let requestRef = dbRef.child("requests").child(trasaction_id);

    let items = [];
    let items_category = [];
    let created_at = new Date().toString();

    dbRef
      .child("bookings/" + uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach(function (childsnap) {
            id = childsnap.val()["id"];
            category = childsnap.val()["category"];
            service = childsnap.val()["service"];
            service_date = childsnap.val()["service_date"];
            service_price = childsnap.val()["service_price"];
            service_currency = childsnap.val()["service_currency"];
            status = childsnap.val()["status"];
            address = childsnap.val()["address"];
            contact_no = childsnap.val()["contact_no"];
            is_visible = childsnap.val()["is_visible"];
            is_service_added = childsnap.val()["is_service_added"];

            if (is_visible === true && is_service_added === true) {
              let updates = {};
              updates["is_visible"] = false;
              updates["is_booked"] = true;
              dbRef
                .child("bookings/" + user["uid"])
                .child(id)
                .update(updates);
              items.push(id);
              items_category.push({
                id,
                category,
                service,
                service_date,
                service_price,
                service_currency,
                address,
                contact_no,
                status,
              });
            }
          });

          transactionRef.set({
            total_price: totalServicePrice,
            created_at: created_at,
            service_currency: serviceCurrency,
            booking_info: items_category,
            paymentMethod: paymentMethodValue,
            paymentId: paymentId,
          });

          requestRef.set({
            total_price: totalServicePrice,
            created_at: created_at,
            service_currency: serviceCurrency,
            booking_info: items_category,
            uid: uid,
            displayName: displayName,
            photoURL: photoURL,
            paymentMethod: paymentMethodValue,
            paymentId: paymentId,
          });
        }

        getServiceInfo();
      });
  };

  const addServiceInfo = () => {
    setErrorMessage("");

    if (categoryCurrentValue === null) {
      setErrorMessage("Please select category");
      return;
    } else if (serviceCurrentValue === null) {
      setErrorMessage("Please select service");
      return;
    } else if (serviceDateCurrentValue === "") {
      setErrorMessage("Please select date of service");
      return;
    } else if (actualDate.getTime() <= new Date().getTime()) {
      setErrorMessage("Please select valid date of service");
      return;
    } else if (address === "") {
      setErrorMessage("Please set your address");
    } else if (contactNo === "") {
      setErrorMessage("Please set your contact number");
    } else if (!/^(09|\+639)\d{9}$/.test(contactNo)) {
      setErrorMessage("Please set valid contact number");
    } else {
      setIsVisible(true);

      let user = firebase.auth().currentUser;
      let id = new Date().getTime().toString();
      let dte = new Date().toString();

      dbRef.child("bookings/" + user["uid"] + "/" + id).set({
        id: id,
        category: categoryCurrentValue,
        service: serviceCurrentValue,
        service_date: serviceDateCurrentValue,
        service_price: servicePrice,
        service_currency: serviceCurrency,
        address: address,
        contact_no: contactNo,
        is_visible: isVisible,
        is_booked: isBooked,
        is_service_added: isServiceAdded,
        status: status,
        createdDate: dte,
      });
    }
  };

  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  const handleDatePicked = (date) => {
    let parsed_date = String(date).split(" ");
    let day = parsed_date[0];
    let month = parsed_date[1];
    let dayn = parsed_date[2];
    let year = parsed_date[3];
    let displayDate = month + " " + dayn + " " + year + ", " + day;

    setActualDate(date);
    setServiceDateCurrentValue(displayDate);
    hideDateTimePicker();
  };

  const addZeros = (totalServicePrice) => {
    return parseInt(totalServicePrice + "00");
  };

  const createSource = async () => {
    try {
      let amount = addZeros(totalServicePrice);
      let ptype = "";
      if (paymentMethodValue === "GCash") {
        ptype = "gcash";
      }
      if (paymentMethodValue === "GrabPay") {
        ptype = "grab_pay";
      }

      const url = "https://api.paymongo.com/v1/sources";
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
              amount: amount,
              redirect: {
                success: "https://google.com",
                failed: "https://youtube.com",
              },
              currency: "PHP",
              type: ptype,
            },
          },
        }),
      };

      fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          let url = json["data"]["attributes"]["redirect"]["checkout_url"];
          let id = json["data"]["id"];
          let type = json["data"]["type"];

          setPaymentURL(url);
          setSourceId(id);
          setType(type);
          WebBrowser.openBrowserAsync(url);
        })
        .catch((err) => {});
    } catch (error) {
    } finally {
    }
  };

  const createPayment = async () => {
    if (sourceId != "") {
      let amount = addZeros(totalServicePrice);
      const url = "https://api.paymongo.com/v1/payments";
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
              amount: amount,
              source: { id: sourceId, type: type },
              currency: "PHP",
            },
          },
        }),
      };

      fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          let pid = json["data"]["id"];
          let type = json["data"]["type"];
          if (type === "payment" && pid !== "") {
            setPaymentId(pid);
            updateBookingDetails();
            setIsDoneDialogVisible(true);
            clearState();
            setIsConfirmDisabled(true);
          }
        })
        .catch((err) => {
          setErrorMessage("Failed to confirm payment");
          setIsConfirmDisabled(true);
          setIsAddBookItNowDisabled(false);
        });
    }
  };

  const renderItemComponent = (data) => (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: data.item.is_service_added ? "green" : "red",
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        justifyContent: "center",
      }}
    >
      <AntDesign
        style={{
          textAlign: "right",
          position: "relative",
          marginTop: 5,
          marginRight: 5,
        }}
        name="closecircle"
        size={24}
        color="#F44336"
        onPress={() => {
          let user = firebase.auth().currentUser;

          dbRef
            .child("bookings/" + user["uid"] + "/" + data.item.id)
            .remove()
            .then(() => {
              let filteredData = serviceInfo.filter((item) => item.id !== id);
              setServiceInfo(filteredData);
            });
          getServiceInfo();
        }}
      />

      <View
        style={{
          flexDirection: "column",
          padding: 5,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <MaterialIcons
            style={style.icon}
            name="category"
            size={24}
            color="#E65100"
          />

          <Text
            style={{
              marginLeft: 10,
              fontWeight: "400",
              alignSelf: "center",
            }}
          >
            {data.item.category}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "column",
          padding: 5,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <MaterialIcons
            style={style.icon}
            name="cleaning-services"
            size={24}
            color="#9E9D24"
          />

          <Text
            style={{
              marginLeft: 10,
              fontWeight: "400",
              alignSelf: "center",
            }}
          >
            {data.item.service}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "column", padding: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <MaterialIcons
            style={style.icon}
            name="date-range"
            size={24}
            color="#0D47A1"
          />

          <Text
            style={{
              alignSelf: "center",
              marginLeft: 10,
              fontWeight: "400",
            }}
          >
            {data.item.service_date}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "column", padding: 5 }}>
        <View style={{ flexDirection: "row" }}>
          <MaterialIcons
            style={style.icon}
            name="contact-phone"
            size={24}
            color="#2E7D32"
          />

          <Text
            style={{
              alignSelf: "center",
              marginLeft: 10,
              fontWeight: "400",
            }}
          >
            {data.item.contact_no}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          padding: 5,
        }}
      >
        <MaterialIcons
          style={style.icon}
          name="add-location"
          size={24}
          color="#B71C1C"
        />

        <Text
          style={{
            marginLeft: 10,
            fontWeight: "400",
            fontSize: 12,
            alignSelf: "center",
          }}
        >
          {data.item.address}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          padding: 5,
        }}
      >
        <MaterialIcons
          style={style.icon}
          name="money"
          size={24}
          color="#424242"
        />

        <Text
          style={{
            marginLeft: 10,
            fontWeight: "400",
            alignSelf: "center",
          }}
        >
          {data.item.service_currency} {data.item.service_price.toFixed(2)}
        </Text>
      </View>

      <View
        style={{
          alignItems: "flex-end",
        }}
      >
        <CheckBox
          title="Add to reservation list"
          checked={data.item.is_service_added}
          containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
          onPress={() => {
            let updates = {};
            let user = firebase.auth().currentUser;
            let uid = user["uid"];
            if (data.item.is_service_added === true) {
              updates[
                "bookings/" + uid + "/" + data.item.id + "/is_service_added"
              ] = false;
              dbRef.update(updates);
            } else {
              updates[
                "bookings/" + uid + "/" + data.item.id + "/is_service_added"
              ] = true;
              dbRef.update(updates);
            }
            getServiceInfo();
          }}
        />
      </View>
    </View>
  );

  const handleCancel = () => {
    setIsDialogVisible(false);
  };

  const handleProceed = () => {
    console.log(paymentMethodValue);
    setErrorMessage("");
    if (paymentMethodValue !== "Select an item...  ") {
      if (paymentMethodValue === "Cash") {
        updateBookingDetails();
        setIsDoneDialogVisible(true);
        clearState();
      } else if (
        paymentMethodValue === "GCash" ||
        paymentMethodValue === "GrabPay"
      ) {
        createSource();
        setIsAddBookItNowDisabled(true);
        setIsConfirmDisabled(false);
      } else if (paymentMethodValue === "Credit Card") {
        setIsConfirmDisabled(false);
        navigation.navigate("CreditCard", { amount: totalServicePrice });
        setIsAddBookItNowDisabled(false);
      }
      setIsDialogVisible(false);
    } else {
      setErrorMessage("Please select payment method");
    }
  };

  const handleDone = () => {
    setIsDoneDialogVisible(false);
  };

  const clearState = () => {
    getCategoryList();
    getServiceInfo();
    getUserInfo();
    setCategoryCurrentValue("");
    setServiceCurrentValue("");
    setServiceDateCurrentValue("");
    setPaymentMethodValue("");
    setErrorMessage("");
    setPaymentIcon(require("../assets/" + "Default" + ".png"));
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <ScrollView>
        <View style={style.viewErrorMessage}>
          <Text style={style.labelErrorMessage}>{errorMessage}</Text>
        </View>

        <View style={style.viewComponent}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <MaterialIcons
              style={style.icon}
              name="category"
              size={24}
              color="#E65100"
            />

            <Text style={style.label}>Category</Text>
          </View>

          <RNPickerSelect
            onValueChange={(value) => {
              setCategoryCurrentValue(value);
              setServiceCurrentValue("");
              setServices([]);
              getServiceList(value);
            }}
            items={categories}
          >
            <Text style={style.input}>
              {categoryCurrentValue
                ? categoryCurrentValue
                : "Select an item..."}
            </Text>
          </RNPickerSelect>
        </View>

        <View style={style.viewComponent}>
          <View style={{ flexDirection: "row" }}>
            <MaterialIcons
              style={style.icon}
              name="cleaning-services"
              size={24}
              color="#9E9D24"
            />

            <Text style={style.label}>Service</Text>
          </View>

          <RNPickerSelect
            onValueChange={(value) => {
              setServiceCurrentValue(value);
            }}
            items={services}
          >
            <Text style={style.input}>
              {serviceCurrentValue ? serviceCurrentValue : "Select an item..."}
            </Text>
          </RNPickerSelect>
        </View>

        <View style={style.viewComponent}>
          <View style={{ flexDirection: "row" }}>
            <MaterialIcons
              style={style.icon}
              name="date-range"
              size={24}
              color="#0D47A1"
            />

            <Text style={style.label}>Date of service</Text>
          </View>

          <Text style={style.input} onPress={showDateTimePicker}>
            {serviceDateCurrentValue
              ? serviceDateCurrentValue
              : "Please pick a date"}
          </Text>

          <DateTimePicker
            isVisible={isDateTimePickerVisible}
            onConfirm={handleDatePicked}
            onCancel={hideDateTimePicker}
            display="default"
          />
        </View>

        <View style={style.viewComponent}>
          <View style={{ flexDirection: "row" }}>
            <MaterialIcons
              style={style.icon}
              name="add-location"
              size={24}
              color="#B71C1C"
            />

            <ToggleSwitch
              isOn={isUseDefaultAddress}
              onColor="green"
              label="Use default address"
              labelStyle={style.toggleLabel}
              offColor="red"
              size="small"
              onToggle={() => {
                getUserInfo();

                if (isUseDefaultAddress === true) {
                  setIsUseDefaultAddress(false);
                  setIsAddressEditable(true);
                } else {
                  setIsUseDefaultAddress(true);
                  setIsAddressEditable(false);
                }
              }}
            />
          </View>

          <TextInput
            style={style.input}
            multiline={false}
            value={address}
            placeholder={"Lot/Block No, Street, City, Province"}
            editable={isAddressEditable}
            onChangeText={(address) => setAddress(address)}
          />
        </View>

        <View>
          <View style={{ flexDirection: "row" }}>
            <MaterialIcons
              style={style.icon}
              name="contact-phone"
              size={24}
              color="#2E7D32"
            />

            <ToggleSwitch
              isOn={isUseDefaultContactNo}
              onColor="green"
              label="Use default mobile number"
              labelStyle={style.toggleLabel}
              offColor="red"
              size="small"
              onToggle={() => {
                getUserInfo();

                if (isUseDefaultContactNo === true) {
                  setIsUseDefaultContactNo(false);
                  setIsContactNoEditable(true);
                } else {
                  setIsUseDefaultContactNo(true);
                  setIsContactNoEditable(false);
                }
              }}
            />
          </View>

          <TextInput
            style={style.input}
            value={contactNo}
            placeholder={"0917XXXXXXX"}
            editable={isContactNoEditable}
            onChangeText={(contactNo) => setContactNo(contactNo)}
          />
        </View>

        <View
          style={([style.viewComponent], { marginBottom: 15, marginTop: 15 })}
        >
          <TouchableOpacity
            style={[
              style.button,
              { backgroundColor: isAddServiceDisabled ? "gray" : "#039BE5" },
            ]}
            onPress={() => {
              addServiceInfo();
              getServiceInfo();
            }}
            disabled={isAddServiceDisabled}
          >
            <Text style={style.touchButtonLabel}>Add service</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={style.label}>
            Total Reserved Services ({totalReserveService})
          </Text>

          <FlatList
            data={serviceInfo ? serviceInfo : null}
            renderItem={(item) => renderItemComponent(item)}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        <View>
          <Text
            style={{
              marginTop: 10,
              marginLeft: 10,
              marginBottom: 10,
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            Total convenience fee: Php{" "}
            {totalServicePrice ? totalServicePrice : 0}
          </Text>

          <Text
            style={{
              marginTop: 3,
              marginLeft: 10,
              marginBottom: 10,
              fontSize: 12,
              fontWeight: "100",
              color: "#F44336",
            }}
          >
            * Actual cost of service is to be billed separately from the
            convenience fee
          </Text>

          <Text style={style.label}>Payment method</Text>

          <RNPickerSelect
            onValueChange={(value) => {
              setPaymentMethodValue(value);

              if (value === "Cash") {
                setPaymentIcon(require("../assets/" + "Cash" + ".png"));
              } else if (value === "GCash") {
                setPaymentIcon(require("../assets/" + "GCash" + ".png"));
              } else if (value === "GrabPay") {
                setPaymentIcon(require("../assets/" + "GrabPay" + ".png"));
              } else if (value === "Credit Card") {
                setPaymentIcon(require("../assets/" + "CreditCard" + ".png"));
              } else {
                setPaymentIcon(require("../assets/" + "Default" + ".png"));
              }
            }}
            items={[
              { label: "Cash", value: "Cash" },
              { label: "GCash", value: "GCash" },
              { label: "GrabPay", value: "GrabPay" },
              { label: "Credit Card", value: "Credit Card" },
            ]}
          >
            <View
              style={{
                borderWidth: 1,
                // borderColor:'#039BE5',
                borderColor: "green",
                borderRadius: 10,
                marginBottom: 5,
                padding: 8,
                textAlign: "left",
                marginLeft: 10,
                marginRight: 10,
                flexDirection: "row",
              }}
            >
              <Text style={{ color: "#424242" }}>
                {paymentMethodValue
                  ? paymentMethodValue + "  "
                  : "Select an item...  "}
              </Text>
              <Image
                style={{ height: 20, width: 20, resizeMode: "contain" }}
                // source={require("../assets/gcash.png")}
                source={paymentIcon}
                // style={style.logo}
              />
            </View>
          </RNPickerSelect>

          <View style={style.viewTermsAndCondition}>
            <View>
              <View>
                <Anchor href="https://handyman-plus.web.app/repair-and-maintenance-agreement">
                  <Text style={{ fontSize: 15 }}>
                    Agree to the Repair and Maintenance Agreement
                  </Text>
                </Anchor>
              </View>
            </View>

            <ToggleSwitch
              isOn={isAgree}
              onColor="green"
              offColor="red"
              size="small"
              label=""
              labelStyle={{
                marginLeft: 12,
                marginBottom: 5,
                fontSize: 17,
              }}
              onToggle={() => {
                if (isAgree === true) {
                  setIsAgree(false);
                } else {
                  setIsAgree(true);
                }
              }}
              style={{
                marginLeft: 5,
              }}
            />
          </View>

          <View style={{ marginTop: 15, marginBottom: 15 }}>
            <TouchableOpacity
              style={[
                style.button,
                {
                  backgroundColor: isAddBookItNowDisabled ? "gray" : "#039BE5",
                },
              ]}
              onPress={() => {
                if (serviceInfo.length === 0) {
                  setErrorMessage("Please add service/s");
                  return;
                } else if (totalReserveService < 1) {
                  setErrorMessage("Please add service to list");
                  return;
                } else if (paymentMethodValue === "") {
                  setErrorMessage("Please select payment method");
                  return;
                } else if (isAgree === false) {
                  setErrorMessage(
                    "Please agree on Repair and Maintenance Agreement"
                  );
                  return;
                } else {
                  setIsDialogVisible(true);
                }
              }}
              disabled={isAddBookItNowDisabled}
            >
              <Text style={style.touchButtonLabel}>Book it now</Text>
            </TouchableOpacity>

            <View style={style.viewErrorMessage}>
              <Text style={style.labelErrorMessage}>{errorMessage}</Text>
            </View>
          </View>

          <View style={{ marginTop: 0, marginBottom: 15 }}>
            <TouchableOpacity
              style={[
                style.button,
                {
                  backgroundColor: isConfirmDisabled ? "white" : "#039BE5",
                  borderColor: isConfirmDisabled ? "white" : "#039BE5",
                },
              ]}
              onPress={() => {
                //createPayment();
                console.log(route.params);
              }}
              disabled={isConfirmDisabled}
            >
              <Text style={style.touchButtonLabel}>Confirm payment</Text>
            </TouchableOpacity>
          </View>

          <Dialog.Container visible={isDialogVisible}>
            <Dialog.Title>Book it now!</Dialog.Title>
            <Dialog.Description>Do you want to proceed?</Dialog.Description>
            <Dialog.Button label="Cancel" onPress={() => handleCancel()} />
            <Dialog.Button label="Ok" onPress={() => handleProceed()} />
          </Dialog.Container>

          <Dialog.Container visible={isDoneDialogVisible}>
            <Dialog.Title>Thank you!</Dialog.Title>
            <Dialog.Description>
              You can check the status of your booking at Transactions tab
            </Dialog.Description>
            <Dialog.Button label="Ok" onPress={() => handleDone()} />
          </Dialog.Container>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  viewErrorMessage: {
    // flex:2,
    backgroundColor: "white",
    justifyContent: "center",
  },

  viewComponent: {
    justifyContent: "center",
    marginBottom: 8,
  },

  button: {
    ...Button.standard,
    marginLeft: 10,
    marginRight: 10,
  },

  icon: {
    marginLeft: 10,
  },

  input: {
    ...Input.standard,
    marginLeft: 10,
    marginRight: 10,
  },

  label: {
    ...Label.standard,
    marginTop: 2,
    marginLeft: 5,
    marginBottom: 8,
  },

  labelErrorMessage: {
    ...Label.self_alignment,
    ...Label.text_alignment,
    ...Label.weight,
    ...Label.red,
    marginTop: 10,
  },

  toggleLabel: {
    marginLeft: 5,
    marginBottom: 8,
    fontSize: 17,
  },

  touchButton: {
    ...Button.border,
    ...Button.color,
    ...Button.padding,
    ...Button.alignment,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 15,
  },

  touchButtonLabel: {
    ...Button.label,
  },

  viewTermsAndCondition: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});

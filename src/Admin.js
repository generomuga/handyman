import React, { Component } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";

import * as firebase from "firebase";
import { get } from "react-native/Libraries/Utilities/PixelRatio";
const dbRef = firebase.database().ref();

import Dialog from "react-native-dialog";

export default class Admin extends Component {
  componentDidMount() {
    this.getServiceInfo();
  }

  // componentDidUpdate() {
  //     this.getServiceInfo()
  // }

  constructor(props) {
    super(props);

    this.state = {
      serviceInfo: [],
      isDialogVisible: false,
    };
  }

  showDialog = () => {
    this.setState({ isDialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ isDialogVisible: false });
  };

  handleAccept = (transaction_id) => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic

    const user = firebase.auth().currentUser;

    const uid = user["uid"];

    var updates = {};
    updates["bookings/" + uid + "/" + transaction_id + "/status"] = "Accepted";
    dbRef.update(updates);
    this.setState({ isDialogVisible: false });
    this.getServiceInfo();
  };

  getServiceInfo() {
    const user = firebase.auth().currentUser;

    var items = [];
    var id = "";
    var category = "";
    var service = "";
    var service_date = "";
    var service_price = 0;
    var service_currency = "";
    var totalPrice = 0;
    var totalReserveService = 0;
    var contact_no = "";
    var is_visible = false;
    var is_booked = false;
    var createdDate = "";

    dbRef
      .child("bookings/" + user["uid"])
      .orderByKey()
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
            status = childsnap.val()["status"];
            createdDate = childsnap.val()["createdDate"];

            if (
              is_visible === false &&
              is_booked === true &&
              status === "Pending"
            ) {
              totalPrice = totalPrice + service_price;
              totalReserveService = totalReserveService + 1;

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
                status,
                createdDate,
              });
            }
          });

          this.setState({ serviceInfo: items });
        } else {
        }
      });
  }

  renderItemComponent = (data) => {
    // this.getBookingDetails()

    return (
      <View style={{ borderWidth: 1 }}>
        <Text>{data.item.id}</Text>

        <Text>{data.item.category}</Text>

        <Text>{data.item.service}</Text>
        <Text>{data.item.service_date}</Text>
        <Text>{data.item.status}</Text>
        <Button
          title={data.item.status}
          onPress={() => {
            const user = firebase.auth().currentUser;

            const uid = user["uid"];
            const transaction_id = data.item.id;

            this.setState({ isDialogVisible: true });
          }}
        />
        <Dialog.Container visible={this.state.isDialogVisible}>
          <Dialog.Title>Accept it now!</Dialog.Title>
          <Dialog.Description>Do you want to accept?</Dialog.Description>
          <Dialog.Button label="Cancel" onPress={() => this.handleCancel()} />
          <Dialog.Button
            label="Ok"
            onPress={() => this.handleAccept(data.item.id)}
          />
        </Dialog.Container>
        <Text>{data.item.createdDate}</Text>
      </View>
    );
  };

  render() {
    return (
      <View>
        <Text>Transactions</Text>

        <Text>Scroll down to refresh</Text>

        <FlatList
          data={this.state.serviceInfo}
          renderItem={(item) => this.renderItemComponent(item)}
          keyExtractor={(item) => item.id.toString()}
          inverted={true}
          horizontal={false}
          // onScroll={()=>{this.getServiceInfo()}}
          onScrollBeginDrag={() => this.getServiceInfo()}
          onScrollEndDrag={() => this.getServiceInfo()}
        />
      </View>
    );
  }
}

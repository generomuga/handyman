import React, { useState, useEffect } from "react";

import { View, Text, FlatList, Image } from "react-native";

import * as firebase from "firebase";

const dbRef = firebase.database().ref();

export default function HomeTab({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getServices();
    });

    return unsubscribe;
  }, [navigation]);

  const [services, setServices] = useState([]);

  const getServices = () => {
    let items = [];
    let [id, serviceName, photoURL] = "";

    dbRef
      .child("tenant/services")
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach(function (childsnap) {
            childsnap.forEach(function (snap) {
              id = snap.val()["id"];
              serviceName = snap.val()["name"];
              photoURL = snap.val()["photoURL"];
              items.push({
                id: id,
                name: serviceName,
                photoURL: photoURL,
              });
            });
          });
        }

        setServices(items);
      });
  };

  const renderItemComponent = (data) => (
    <View
      style={{
        margin: 10,
        flex: 1,
        flexDirection: "column",
      }}
    >
      <Image
        style={{
          width: '100%',
          height: 'auto',
          aspectRatio: 1,
          resizeMode: "cover",
          alignSelf: "center",
          borderRadius: 5,
        }}
        source={{ uri: data.item.photoURL }}
      />

      <Text
        style={{
          marginTop: 10,
          textAlign: "center",
          fontWeight: "400",
          fontSize: 15,
        }}
        onPress={() => {
          // navigation.jumpTo('Book',{category:'Service'})
        }}
      >
        {data.item.name}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        color: "#FFFFFF",
      }}
    >
      {/* <Text
            style={{
              fontSize:21,
              color:'#424242',
              marginLeft:10,
              marginTop:10
            }} >
            Hugefort Services
          </Text>

          <FlatList
            data={hugefortServices}
            renderItem={item => renderItemComponent(item)}
            keyExtractor={item => item.id.toString()}
            horizontal={true} /> */}

      <Text
        style={{
          fontSize: 21,
          color: "#424242",
          marginLeft: 10,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        Handyman Plus Services
      </Text>

      <FlatList
        style={{ marginBottom: 40 }}
        data={services}
        renderItem={(item) => renderItemComponent(item)}
        keyExtractor={(item) => item.id.toString()}
        horizontal={false}
        numColumns={2}
      />
    </View>
  );
}

import * as firebase from "firebase";
import { firebaseConfig } from "../config/config";

class Database {
  init() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  initialize_db() {
    const ref = firebase.database();
  }

  registerUser(user) {
    firebase
      .database()
      .ref("users/" + user["uid"])
      .set({
        displayName: user["displayName"] ? user["displayName"] : "",
        gender: user["gender"] ? user["gender"] : "",
        email: user["email"],
        emailVerified: user["emailVerified"],
        photoURL: user["photoURL"] ? user["photoURL"] : "",
        contactNo: user["contactNo"] ? user["contactNo"] : "",
        address: user["address"] ? user["address"] : "",
      });
  }

  isUserExists(user) {
    const dbRef = firebase.database().ref();

    dbRef
      .child("users")
      .child(user["uid"])
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("user found");
        } else {
          console.log("user not found");
          this.registerUser(user);
        }
      });
  }

  loginWithEmailAndPassword(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        const emailVerified = user.emailVerified;

        if (emailVerified === true) {
          this.props.navigation.navigate("Home");
        } else {
          // return false
          this.props.navigation.navigate("Login");
          // this.setState({errorMsg: '* Please verify your account through your email'})
        }
      })
      .catch((error) => {
        // this.setState({errorMsg:'* Your email or password is incorrect.'})
        // return false
      });
  }
}

const database = new Database();

export default database;

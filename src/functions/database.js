import * as firebase from 'firebase';
import { firebaseConfig } from '../config/config';

class Database {

    init(){
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
            .ref('users/' + user['uid'])
            .set({
                displayName: user['displayName'],
                email: user['email'],
                emailVerified: user['emailVerified'],
                phoneNumber: user['phoneNumber'],
                metadata: user['metadata']
            });
    }

}

const database = new Database();

export default database;
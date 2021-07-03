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
                displayName: user['displayName'] ? user['displayName'] : '',
                email: user['email'],
                emailVerified: user['emailVerified'],
                photoURL: user['photoURL'] ? user['photoURL'] : 'not set',
                contactNo: user['contactNo'] ? user['contactNo'] : 'not set',
                address: user['address'] ? user['address'] : 'not set',
            });
    }
}

const database = new Database();

export default database;
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
                photoURL: user['photoURL'],
                // contactNo: typeof user['contactNo'] !== 'undefined' ? user['contactNo'] : 'not set',
                // address: typeof user['address'] !== 'undefined' ? user['address'] : 'not set',
                // metadata: user['metadata']
                // photoUrl: user.photoUrl
            });
    }

}

const database = new Database();

export default database;
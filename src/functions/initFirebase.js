import * as firebase from 'firebase';
import { firebaseConfig } from '../config/config';

class InitFirebase {

    init_firebase(){
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
          }
    }

    initialize_db() {
        const ref = firebase.database();
    }

}

const initFirebase = new InitFirebase();

export default initFirebase;
import React, { Component } from 'react';
import { 
    View, 
    TextInput, 
    Text,
    CheckBox,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { 
    Background, 
    InputText, 
    Button
} from './styles';

import { 
    FontAwesome5, 
    FontAwesome 
} from '@expo/vector-icons';

import * as firebase from 'firebase';
import { firebaseConfig } from './config/config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class Signup extends Component {

    constructor(props){
        super(props)

        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false
        }
    }

    isEmpty(text) {
        if (text.trim() === '') {
            return true
        }
        else 
            return false
    }

    isNotValidEmail(text) {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (pattern.test(text) === false) {
            return true;
        }
        else {
            return false
        }
    }

    isNotValidPassword(text) {
        if (text.length < 8) {
            return true
        }
        else {
            return false
        }
    }

    _onSignUpPress() {
        // this.state({error:'', loading:false});

        const {email, password} = this.state;


        if (this.isEmpty(email)) {
            console.log('Empty email')
            return
        }

        if (this.isNotValidEmail(email)) {
            console.log('Invalid email')
            return
        }

        if (this.isEmpty(password)) {
            console.log('Empty password')
            return
        }

        if (this.isNotValidPassword(password)) {
            console.log('Not valid password')
            return
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                
                // ...

                firebase.auth().currentUser.sendEmailVerification()
                .then(() => {
                    // Email verification sent!
                    // ...
                });
            })
            .catch((error) => {
                //error = error.code;
                error = error.message;
                // ..
            });
        }

    render(){
        return (
            <View style={style.background}>
                
                <View style={style.viewHolder}>

                    <TextInput 
                        style={style.textinput} 
                        placeholder='email' 
                        autoCapitalize='none' 
                        value={this.state.email}
                        onChangeText={email => this.setState({email})}
                        />

                    <TextInput 
                        style={style.textinput} 
                        placeholder='password'
                        autoCapitalize='none' 
                        value={this.state.password}
                        onChangeText={password => this.setState({password})}
                        />

                    <TextInput 
                        style={style.textinput} 
                        placeholder='confirm password'
                        autoCapitalize='none' />

                    <View style={style.checkboxContainer}>
                        <CheckBox
                        // value={isSelected}
                        // onValueChange={setSelection}
                        style={style.checkbox}
                        />
                        <Text style={style.termsCondition}>Agree to Terms and Condition</Text>
                    </View>

                    <TouchableOpacity 
                        style={style.touchbutton}
                        onPress={()=>this._onSignUpPress()}
                        >
                        <Text style={style.touchbuttonlabel}>Join now</Text>
                    </TouchableOpacity>
                    
                    <Text style={style.connect}>
                        ~ or connect with ~
                    </Text>

                    <View style={style.viewGoogleFb}>

                        <FontAwesome 
                          name="google-plus-official" 
                          size={77} 
                          color="#d34836" 
                          style={style.google}
                         //   onPress={() => this.signInWithGoogleAsync()}
                        />

                        <FontAwesome5 
                          name="facebook" 
                          size={68} 
                          color="#4267B2" 
                          style={style.facebook}
                          />

                    </View>

                </View>

            </View>            
        )
    }

}

const style = StyleSheet.create({

    background:{
        ...Background.blue,
        ...Background.fullscreen
    },

    viewHolder: {
        marginTop: '20%'
    },

    textinput:{
        ...InputText.border,
        ...InputText.padding,
        ...InputText.color,
        ...InputText.text_alignment,
        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: '3%'
    },

    touchbutton: {
        ...Button.border,
        ...Button.color,
        ...Button.padding,
        ...Button.alignment,
        marginLeft: '10%',
        marginRight: '10%',
        padding:'4%',
        alignSelf: 'stretch',
        top:'5%',
    },

    checkboxContainer: {
        flexDirection: "row",
        alignSelf: 'center',
        marginTop: '10%'
    },

    checkbox: {
        alignSelf: "center",
        height: 15,
        width: 15,
        marginRight: '5%'
    },

    touchbuttonlabel:{
        ...Button.label
    },

    termsCondition: {
        fontSize: 16,
        fontWeight: '300'
    },

    connect: {
        alignSelf:'center',
        fontSize: 16,
        fontWeight: '300',
        marginTop: '15%'
    },

    viewGoogleFb: {
        marginTop: '5%',
        flexDirection: 'row',
        alignSelf: 'center',
    },

    google: {
        alignSelf:'center',
        margin: '2%'
    },

    facebook: {
        alignSelf:'center',
        margin: '2%'
    },

})
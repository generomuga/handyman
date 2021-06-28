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

import formValidator from './functions/formValidator';

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
            confirmPassword: '',
            errorMsg: '',
            loading: false
        }
    }

    _onSignUpPress() {
        
        const {email, password, errorMsg, confirmPassword} = this.state;

        this.setState({errorMsg:''});

        if (formValidator.isEmailEmpty(email)) {
            this.setState({errorMsg: '* Your email is empty.'})
            return
        }

        if (formValidator.isNotValidEmail(email)) {
            this.setState({errorMsg: '* Your email is invalid.'})
            return
        }

        if (formValidator.isPasswordEmpty(password)) {
            this.setState({errorMsg: '* Your password is empty.'})
            return
        }

        if (formValidator.isNotValidPassword(password)) {
            this.setState({errorMsg: '* Your password should be atleast 8 characters.'})
            return
        }

        if (formValidator.isNotSameText(password, confirmPassword)) {
            this.setState({errorMsg: '* Your password and confirm password should be matched.'})
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
            
                this.setState({errorMsg: error.message})
                // this.setState({errorMsg: error.message})
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
                        secureTextEntry={true}
                        onChangeText={password => this.setState({password})}
                        />

                    <TextInput 
                        style={style.textinput} 
                        placeholder='confirm password'
                        secureTextEntry={true}
                        autoCapitalize='none' 
                        value={this.state.confirmPassword}
                        onChangeText={confirmPassword => this.setState({confirmPassword})}
                        />

                    <Text style={{ marginTop: '1%', alignSelf:'center',textAlign:'center', color: '#D32F2F', fontSize: 16, fontWeight: '300'}}>{this.state.errorMsg}</Text>

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
import React, { Component } from 'react';
import { 
    View, 
    TextInput, 
    Text,
    CheckBox,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import ToggleSwitch from 'toggle-switch-react-native';

import { 
    Background, 
    InputText, 
    Button,
    Label
} from './styles';

import validation from './functions/validation';

import * as firebase from 'firebase';

import { 
    FontAwesome5, 
    FontAwesome 
} from '@expo/vector-icons';

// database.init();

export default class Signup extends Component {

    constructor(props){
        super(props)

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            errorMsg: '',
            loading: false,
            isAgree: true
        }
    }

    _onSignUpPress() {
        
        const {email, password, errorMsg, confirmPassword} = this.state;

        this.setState({errorMsg:''});

        if (validation.isEmailEmpty(email)) {
            this.setState({errorMsg: '* Your email is empty.'})
            return
        }

        if (validation.isNotValidEmail(email)) {
            this.setState({errorMsg: '* Your email is invalid.'})
            return
        }

        if (validation.isPasswordEmpty(password)) {
            this.setState({errorMsg: '* Your password is empty.'})
            return
        }

        if (validation.isNotValidPassword(password)) {
            this.setState({errorMsg: '* Your password should be atleast 8 characters.'})
            return
        }

        if (validation.isNotSameText(password, confirmPassword)) {
            this.setState({errorMsg: '* Your password and confirm password should be matched.'})
            return
        }

        if (this.state.isAgree === false) {
            this.setState({errorMsg: '* Please agree on Terms and Condition'})
            return
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                // ...

                firebase.auth().currentUser.sendEmailVerification()
                .then(() => {
                    
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
                
                <View>

                    <TextInput 
                        style={style.textinput} 
                        placeholder='email' 
                        autoCapitalize='none' 
                        value={this.state.email}
                        onChangeText={email => this.setState({email})} />

                    <TextInput 
                        style={style.textinput} 
                        placeholder='password'
                        autoCapitalize='none' 
                        value={this.state.password}
                        secureTextEntry={true}
                        onChangeText={password => this.setState({password})} />

                    <TextInput 
                        style={style.textinput} 
                        placeholder='confirm password'
                        secureTextEntry={true}
                        autoCapitalize='none' 
                        value={this.state.confirmPassword}
                        onChangeText={confirmPassword => this.setState({confirmPassword})} />

                    <Text 
                        style={style.labelErrorMessage} >
                            {this.state.errorMsg}
                    </Text>

                    <View
                        style={style.viewTermsAndCondition} >

                        <ToggleSwitch
                            isOn={this.state.isAgree}
                            onColor="green"
                            label='Agree on Terms and Condition'
                            labelStyle={{ 
                                marginLeft:10, 
                                marginBottom:5, 
                                fontSize:17 
                            }}
                            offColor="red"
                            size="small"
                            onToggle={()=>{
                                if (this.state.isAgree === true){
                                    this.setState({isAgree:false})   
                                }
                                else {
                                    this.setState({isAgree:true})
                                }
                            }} />
                        
                    </View>

                    <TouchableOpacity 
                        style={style.touchbutton}
                        onPress={()=>this._onSignUpPress()} >

                        <Text 
                            style={style.touchbuttonlabel} >
                                Join now
                        </Text>

                    </TouchableOpacity>
                </View>
                
                <View>

                    <Text 
                        style={style.connect} >
                            ~ or connect with ~
                    </Text>

                    <View style={style.viewGoogleFb}>

                        <FontAwesome 
                          name="google-plus-official" 
                          size={77} 
                          color="#d34836" 
                          style={style.google} />

                        <FontAwesome5 
                          name="facebook" 
                          size={68} 
                          color="#4267B2" 
                          style={style.facebook} />

                    </View>

                </View>

            </View>            
        )
    }

}

const style = StyleSheet.create({

    background:{
        ...Background.blue,
        ...Background.fullscreen,
        ...Background.center_content
    },

    textinput:{
        ...InputText.border,
        ...InputText.padding,
        ...InputText.color,
        ...InputText.text_alignment,
        ...InputText.side_margin,
        marginBottom: 10
    },

    touchbutton: {
        ...Button.border,
        ...Button.color,
        ...Button.padding,
        ...Button.alignment,
        ...Button.side_margin,
        top:'5%',
    },

    viewTermsAndCondition: {
        flexDirection: "row",
        alignSelf: 'center',
        marginTop: 5
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

    labelErrorMessage: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight,
        ...Label.red,
        marginBottom:10
    }

})
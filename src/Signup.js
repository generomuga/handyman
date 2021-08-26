import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import ToggleSwitch from 'toggle-switch-react-native';

import { 
    Background, 
    Input, 
    Button,
    Label
} from './styles';

import validation from './functions/validation';

import { 
    FontAwesome5, 
    FontAwesome 
} from '@expo/vector-icons';

import * as firebase from 'firebase';
import { SafeAreaView } from 'react-navigation';

import Anchor from './Anchor';

export default function Signup (props) {

    const [
        email,
        setEmail,
    ] = useState('');

    const [
        password,
        setPassword,
    ] = useState('');

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState('');

    const [
        isAgreeOnTermsAndCondition,
        setIsAgreeOnTermsAndCondition,
    ] = useState(true); 

    const [
        errorMessage,
        setErrorMessage,
    ] = useState('');

    const onSignUp = ({email, password, confirmPassword, isAgreeOnTermsAndCondition}) => {
        
        setErrorMessage('');

        const [resultIsEmailEmpty, messageIsEmailEmpty] = validation.isEmailEmpty(email)
        if (resultIsEmailEmpty === true) {
            setErrorMessage(messageIsEmailEmpty)
            return
        }

        const [resultIsEmailInvalid, messageIsEmailInvalid] = validation.isEmailInvalid(email)
        if (resultIsEmailInvalid === true) {
            setErrorMessage(messageIsEmailInvalid)
            return
        }

        const [resultIsPasswordEmpty, messageIsPasswordEmpty] = validation.isPasswordEmpty(password)
        if (resultIsPasswordEmpty === true) {
            setErrorMessage(messageIsPasswordEmpty)
            return
        }

        const [resultIsPasswordInvalid, messageIsPasswordInvalid] = validation.isPasswordInvalid(password)
        if (resultIsPasswordInvalid === true) {
            setErrorMessage(messageIsPasswordInvalid)
            return
        }

        const [resultIsPasswordUnequal, messageIsPasswordUnequal] = validation.isPasswordUnequal(password, confirmPassword)
        if (resultIsPasswordUnequal === true) {
            setErrorMessage(messageIsPasswordUnequal)
            return
        }
    
        const [resultIsTermsAndConditionAccepted, messageIsTermsAndConditionAccepted] = validation.isTermsAndConditionNotAccepted(isAgreeOnTermsAndCondition)
        if (resultIsTermsAndConditionAccepted === true) {
            setErrorMessage(messageIsTermsAndConditionAccepted)
            return
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                firebase.auth().currentUser.sendEmailVerification()
                .then(() => {
                    
                });
            })
            .catch((error) => {
                props.navigation.navigate('Signup')
                setErrorMessage(error.message)
            });
        }

    return (

        <SafeAreaView style={style.background}>
            
            <View>

                <TextInput 
                    style={style.textinput} 
                    placeholder='email' 
                    autoCapitalize='none' 
                    value={email}
                    onChangeText={email => setEmail(email)} />

                    <TextInput 
                    style={style.textinput} 
                    placeholder='password'
                    autoCapitalize='none' 
                    value={password}
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)} />

                <TextInput 
                    style={style.textinput} 
                    placeholder='confirm password'
                    secureTextEntry={true}
                    autoCapitalize='none' 
                    value={confirmPassword}
                    onChangeText={confirmPassword => setConfirmPassword(confirmPassword)} />

                <Text 
                    style={style.labelErrorMessage} >
                        {errorMessage}
                </Text>

                <View
                    style={style.viewTermsAndCondition} >

                    <View> 
                        {/* <View > 
                            <Anchor href="https://handyman-plus.web.app/"> 
                            Privacy Policy 
                            </Anchor> 
                        </View>  */}
                        <View> 
                            <Anchor href="https://jsparling.github.io/hashmarks/terms_and_conditions"> 
                                <Text>Agree on Terms and Conditions </Text>
                            </Anchor> 
                        </View> 
                    </View> 

                    <ToggleSwitch
                        isOn = {isAgreeOnTermsAndCondition}
                        onColor = "green"
                        offColor = "red"
                        size = "small"
                        label = ''
                        labelStyle={{ 
                            marginLeft: 10, 
                            marginBottom: 5, 
                            fontSize: 17 
                        }}
                        onToggle = {() => {
                            if (isAgreeOnTermsAndCondition === true) {
                                setIsAgreeOnTermsAndCondition(false)  
                            }
                            else {
                                setIsAgreeOnTermsAndCondition(true)  
                            }
                        }} />

                </View>

                <TouchableOpacity 
                    style={style.touchbutton}
                    onPress={()=> onSignUp({email, password, confirmPassword, isAgreeOnTermsAndCondition})} >

                    <Text 
                        style={style.touchbuttonlabel} >
                            Join now
                    </Text>

                </TouchableOpacity>
            </View>
            
            {/* <View>

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

            </View> */}
            



        </SafeAreaView>            
    )

}

const style = StyleSheet.create({

    background:{
        ...Background.blue,
        ...Background.fullscreen,
        ...Background.center_content
    },

    textinput:{
        ...Input.border,
        ...Input.padding,
        ...Input.color,
        ...Input.text_alignment,
        ...Input.side_margin,
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
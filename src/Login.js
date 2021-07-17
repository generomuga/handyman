import React, { Component } from 'react';

import { 
    Image, 
    SafeAreaView, 
    View,
    TextInput, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Alert 
} from 'react-native';

import { 
    Background, 
    Button,
    InputText,
    Label
} from './styles';

import * as firebase from 'firebase';

import validation from './functions/validation';
import database from './functions/database';
import authentication from './functions/authentication';

import { 
    FontAwesome5, 
    FontAwesome 
} from '@expo/vector-icons';

database.init();

export default class Login extends Component {

    componentDidMount() {
        this.checkIfLoggedIn();
    }
  
    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            
            if (user) {
                const user = firebase.auth().currentUser;
                    
                if (user !== null) {
                    
                    const emailVerified = user.emailVerified;
                    
                    database.isUserExists(user);

                    if (emailVerified === true) {
                        this.props.navigation.navigate('Home')
                    }
                    
                    else {
                        this.props.navigation.navigate('Login')
                        this.setState({errorMsg: '* Please verify your account through your email'})
                        console.log('wala')
                    }
                }

            }
            else {
                this.props.navigation.navigate('Login')
            }

        }

    )}

    _onLoginPress() {

        const {email, password, errorMsg} = this.state;

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

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;

                const emailVerified = user.emailVerified;
                
                console.log(emailVerified);

                if (emailVerified === true) {
                    this.props.navigation.navigate('Home')
                }
                else {
                    this.props.navigation.navigate('Login')
                    this.setState({errorMsg: '* Please verify your account through your email'})
                }

            })
            .catch((error) => {
                this.setState({errorMsg:'* Your email or password is incorrect.'})
            });
    }

    constructor(props){
        super(props)

        this.state = {
            email: '',
            password: '',
            errorMsg: '',
            isRegistered: false
        }

    }

    render(){
        return (
            <SafeAreaView style={style.background}>
                
                <View style={style.viewLogo}>

                    <Image 
                        source={require('../assets/hugefort-ico.png')}
                        style={style.logo} />

                </View>

                <View style={style.viewTextInput}>

                    <TextInput 
                        style={style.textInput} 
                        placeholder='email' 
                        autoCapitalize='none' 
                        value={this.state.email}
                        onChangeText={email => this.setState({email})} />

                    <TextInput 
                        style={style.textInput} 
                        placeholder='password' 
                        secureTextEntry={true} 
                        autoCapitalize='none' 
                        value={this.state.password}
                        onChangeText={password => this.setState({password})} />

                    <Text style={style.labelErrorMessage}>
                        {this.state.errorMsg}
                    </Text>

                    <TouchableOpacity 
                        style={style.touchButton}
                        onPress={()=>this._onLoginPress()}>

                        <Text style={style.touchButtonLabel}>
                            Login
                        </Text>

                    </TouchableOpacity>

                    <Text 
                        style={style.forgotPassword}
                        onPress={()=>this.props.navigation.navigate('ForgotPassword')}>
                        Forgot password
                    </Text>
                    
                </View>

                <View style={style.viewSocialMedia}>

                    <Text style={style.connect}>
                        ~ or connect with ~
                    </Text>

                    <View style={style.viewGoogleFb}>

                        <FontAwesome 
                            name='google-plus-official' 
                            size={77} 
                            color='#d34836' 
                            style={style.google}
                            onPress={() => authentication.signInWithGoogleAsync()} />

                        <FontAwesome5 
                            name='facebook' 
                            size={68} 
                            color='#4267B2'
                            style={style.facebook}
                            onPress={()=> alert('Temporarily disabled')} />

                    </View>
                    
                    <Text
                        style={style.signUp}
                        onPress={()=>this.props.navigation.navigate('Signup')}>
                            Don't have an account? Sign up here
                    </Text>

                </View>

            </SafeAreaView>
        )
    }

}

const style = StyleSheet.create({

    background:{
        ...Background.blue,
        ...Background.fullscreen,
        ...Background.center_content
    },

    viewLogo: {
        flex: 3.4, 
        justifyContent: 'flex-start'
    },

    logo: {
        width: 300,
        height: 300, 
        alignSelf:'center',
    },

    viewTextInput: {
        flex: 3.5, 
        ...Background.center_content
    },

    textInput:{
        ...InputText.border,
        ...InputText.padding,
        ...InputText.color,
        ...InputText.text_alignment,
        ...InputText.side_margin,
        marginBottom: 10
    },

    labelErrorMessage: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight,
        ...Label.red,
        marginBottom:10
    },

    touchButton: {
        ...Button.border,
        ...Button.color,
        ...Button.padding,
        ...Button.alignment,
        ...Button.side_margin,
        marginBottom: 20,
    },

    touchButtonLabel:{
        ...Button.label
    },

    forgotPassword: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight
    },

    viewSocialMedia: {
        flex: 3.5, 
        ...Background.center_content
    },

    connect: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight
    },

    viewGoogleFb: {
        marginTop: 10,
        flexDirection: 'row',
        alignSelf: 'center',
    },

    google: {
        alignSelf:'center',
        margin: 10
    },

    facebook: {
        alignSelf:'center',
        margin: 10
    },

    signUp: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight,
        marginTop: 10
    }

});
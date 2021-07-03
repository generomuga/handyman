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
    InputText, 
    Button 
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
                    
                    console.log('ngang'+emailVerified);


                    const dbRef = firebase.database().ref();

                    dbRef
                        .child('users')
                        .child(user['uid'])
                        .get()                        
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                console.log('user exists in db');
                            } else {
                                console.log('not found');
                                database.registerUser(user);
                            }
                        });

                    if (emailVerified === true) {
                        this.props.navigation.navigate('Home')
                    }
                    
                    else {
                        this.props.navigation.navigate('Login')
                        this.setState({errorMsg: '* Please verify your account through your email'})
                        // database.registerUser(user);
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
                
                <View style={{ flex:2.9, backgroundColor: "#B3E5FC", justifyContent:"flex-start" }} >

                    <Image 
                        source={require('../assets/hugefort-ico.png')}
                        style={style.logo} />

                </View >

                <View style={{ flex: 1.1, backgroundColor: "#B3E5FC", justifyContent:'flex-start' }}>

                    <Text
                      style={style.tagline}>
                        Best Service. Right Time. Right People 
                    </Text>

                </View>

                <View style={{ flex: 4.5, backgroundColor: "#B3E5FC", justifyContent:'center' }} >

                    <TextInput 
                        style={style.textInput} 
                        placeholder='email' 
                        autoCapitalize='none' 
                        value={this.state.email}
                        onChangeText={email => this.setState({email})}
                        />

                    <TextInput 
                        style={style.textInput} 
                        placeholder='password' 
                        secureTextEntry={true} 
                        autoCapitalize='none' 
                        value={this.state.password}
                        onChangeText={password => this.setState({password})}
                        />

                    <Text style={{alignSelf:'center',textAlign:'center', color: '#D32F2F', fontSize: 16, fontWeight: '300', marginBottom:10}}>{this.state.errorMsg}</Text>

                    <TouchableOpacity 
                        style={style.touchButton}
                        onPress={()=>this._onLoginPress()}
                        >
                        <Text style={style.touchButtonLabel}>Login</Text>
                    </TouchableOpacity>

                    <Text 
                        style={style.forgotPassword}
                        onPress={()=>this.props.navigation.navigate('ForgotPassword')}
                        >
                        Forgot password
                    </Text>
                    
                </View>

                <View style={{ flex: 3, backgroundColor: "#B3E5FC", justifyContent:'center' }} >

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
                          onPress={() => authentication.signInWithGoogleAsync()}
                          />

                        <FontAwesome5 
                          name="facebook" 
                          size={68} 
                          color="#4267B2" 
                          style={style.facebook}
                          onPress={()=> alert('Temporarily disabled')}
                          />

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

    logo: {
        width: 300,
        height: 300, 
        alignSelf:'center',
        marginTop: 20
    },

    tagline:{
        textAlign: 'center',
        position: 'absolute',
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: '400'
    },

    background:{
        ...Background.blue,
        ...Background.fullscreen
    },

    textInput:{
        ...InputText.border,
        ...InputText.padding,
        ...InputText.color,
        ...InputText.text_alignment,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 10
    },

    touchButton: {
        ...Button.border,
        ...Button.color,
        ...Button.padding,
        ...Button.alignment,
        marginLeft: 40,
        marginRight: 40,
        padding: 15,
        alignSelf: 'stretch',
        marginBottom: 20
    },

    touchButtonLabel:{
        ...Button.label
    },

    forgotPassword: {
        alignSelf:'center',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '300'
    },

    connect: {
        alignSelf:'center',
        fontSize: 16,
        fontWeight: '300',
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
        alignSelf:'center',
        textAlign:'center',
        fontSize: 16,
        fontWeight: '300',
        marginTop: 10
    }

});
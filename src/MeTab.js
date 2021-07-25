import React, { useEffect, useState } from 'react';

import { 
    View, 
    Text, 
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
} from 'react-native';

import {  
    Button,
    Input,
    Label
} from './styles';

import * as firebase from 'firebase';

import database from './functions/database';

import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';

import Spinner from 'react-native-loading-spinner-overlay';

import { MaterialIcons } from '@expo/vector-icons';

// database.init();

const dbRef = firebase.database().ref();

export default function MeTab(props) {
        
    const [
        photoURL,
        setPhotoURL,
    ] = useState('');

    const [
        displayName,
        setDisplayName,
    ] = useState('');

    const [
        isDisplayNameEditable,
        setIsDisplayNameEditable,
    ] = useState(false);

    const [
        gender,
        setGender,
    ] = useState(false);

    const [
        isGenderEditable,
        setIsGenderEditable,
    ] = useState(false);

    const [
        email,
        setEmail,
    ] = useState('');

    const [
        isEmailEditable,
        setIsEmailEditable,
    ] = useState(false);

    const [
        contactNo,
        setContactNo,
    ] = useState('');

    const [
        isContactNoEditable,
        setIsContactNoEditable,
    ] = useState(false);

    const [
        address,
        setAddress,
    ] = useState('');  
    
    const [
        isAddressEditable,
        setIsAddressEditable,
    ] = useState(false);

    const [
        buttonLabel,
        setButtonLabel,
    ] = useState('Edit');

    const [
        isLoading,
        setIsLoading
    ] = useState(false);

    useEffect(()=>{
        getUserDetails()
    },[])

    const getUserDetails = () => {
        
        let user = firebase.auth().currentUser;
        let displayName = ''
        let gender = ''
        let email = ''
        let photoURL = ''
        let contactNo = ''
        let address = ''

        dbRef.child("users").child(user['uid']).once("value")
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    displayName = data['displayName']
                    gender = data['gender']
                    email = data['email']
                    photoURL = data['photoURL']
                    contactNo = data['contactNo']
                    address = data['address']

                    setDisplayName(displayName)
                    setGender(gender)
                    setEmail(email)
                    setPhotoURL(photoURL)
                    setContactNo(contactNo)
                    setAddress(address)
                } 
                else {
                    console.log("No data available");
                }
            });
    }

    const updateUserDetails = () => {
        let user = firebase.auth().currentUser;
        
        let updates = {};
        updates['displayName'] = displayName;
        updates['gender'] = gender;
        updates['contactNo'] = contactNo;
        updates['address'] = address;

        dbRef.child("users").child(user['uid']).update(updates);
    }

    const onPressButton = () => {
     
        if (isDisplayNameEditable === true) {
            setIsDisplayNameEditable(false);
            setIsGenderEditable(false)
            setIsContactNoEditable(false)
            setIsAddressEditable(false)
            setButtonLabel('Edit')

            updateUserDetails();
        }
        else {
            setIsDisplayNameEditable(true);
            setIsGenderEditable(true)
            setIsContactNoEditable(true)
            setIsAddressEditable(true)
            setButtonLabel('Save')
        }

    }

    const onImagePress = async() => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
        else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.05,
                // format: '.png'
              });
    
              if (!result.cancelled) {
                uploadImage(result.uri,'test')
              }
        }
    }

    const uploadImage = async(uri, imageName) => {
        setIsLoading(true);
        const response = await fetch(uri)
        const blob = await response.blob()

        const user = firebase.auth().currentUser;

        var ref = firebase.storage().ref().child('images/'+user['uid']);
        await ref.put(blob)

        const photoURL = await ref.getDownloadURL()
        
        var updates = {}
        updates['photoURL'] = photoURL
        
        dbRef.child('users').child(user['uid']).update(updates)
        setPhotoURL(photoURL)
        setIsLoading(false);
    }


    return (
        <ScrollView>

            <Spinner
                visible={isLoading}
                textContent={'Loading...'} 
                textStyle={style.spinnerTextStyle} />

            <View
                style={style.containerPhoto} >

                <Image 
                    style={style.photo}
                    source={{uri:photoURL?photoURL:Image.resolveAssetSource(require('../assets/user.png')).uri}}
                />

                <View
                    style={{
                        flexDirection:'row',
                        alignSelf: 'center',
                        marginTop: 10,
                        marginBottom: 30
                        }}>

                    <MaterialIcons 
                        name="edit" 
                        size={24} 
                        color="white" />

                    <Text
                        style={{
                            alignSelf: 'center',
                            color: 'white',
                            marginLeft: 5
                        }}
                        onPress={()=>{
                            onImagePress()
                        }}>
                        Change photo
                    </Text>

                </View>

            </View>

            <View
                style={{
                    flexDirection:'row'
                }}>
                <MaterialIcons 
                    style={style.icon}
                    name="perm-identity" 
                    size={24} 
                    color="#6A1B9A" />
                
                <Text
                    style={style.label} >
                    Full name
                </Text>

            </View>

            <TextInput 
                style={[
                    style.textInput,
                    {borderColor:isDisplayNameEditable?'red':'green'}
                ]}
                placeholder='full name' 
                autoCapitalize='none'
                value={displayName?displayName:null}
                editable={isDisplayNameEditable}
                onChangeText={displayName => setDisplayName(displayName)}
                />

            <View
                style={{flexDirection:'row'}}>

                <MaterialIcons 
                    style={style.icon}
                    name="supervised-user-circle" 
                    size={24} 
                    color="#AD1457" />
            
                <Text
                    style={style.label} >
                    Gender
                </Text>

            </View>

            <RNPickerSelect
                onValueChange={(value) => {
                    setGender(value)
                }}
                items={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                ]}
                disabled={!isGenderEditable} >
                <Text
                    // style={style.textInput}
                    style={[
                        style.textInput,
                        {borderColor:isGenderEditable?'red':'green'}
                    ]}
                >{gender?gender:'Select an item...'}</Text>
            </RNPickerSelect>

            <View
                style={{flexDirection:'row'}}>
                
                <MaterialIcons 
                    style={style.icon}
                    name="email" 
                    size={24} 
                    color="#9E9D24" />

                <Text
                    style={style.label} >
                    Email address
                </Text>

            </View>
            
            <TextInput 
                style={style.textInput} 
                placeholder='email' 
                autoCapitalize='none' 
                value={email?email:null}
                editable={isEmailEditable}
                onChangeText={email => setEmail(email)}
                />

            <View
                style={{flexDirection:'row'}}>

                <MaterialIcons 
                    style={style.icon}
                    name="quick-contacts-dialer" 
                    size={24} 
                    color="#2E7D32" />

                <Text
                    style={style.label} >
                    Contact number
                </Text>

            </View>

            <TextInput 
                style={[
                    style.textInput,
                    {borderColor:isContactNoEditable?'red':'green'}
                ]}
                placeholder='contact number' 
                autoCapitalize='none' 
                value={contactNo?contactNo:null}
                editable={isContactNoEditable}
                onChangeText={contactNo => setContactNo(contactNo)}
                />

            <View
                style={{flexDirection:'row'}}>

                <MaterialIcons 
                    style={style.icon}
                    name="add-location" 
                    size={24} 
                    color="#B71C1C" />

                <Text
                    style={style.label} >
                    Home address
                </Text>

            </View>

            <TextInput 
                style={[
                    style.textInput,
                    {borderColor:isAddressEditable?'red':'green'}
                ]}
                placeholder='address' 
                autoCapitalize='none' 
                multiline={false}
                value={address?address:null}
                editable={isAddressEditable}
                onChangeText={address => setAddress(address)}
                />

            <TouchableOpacity 
                style={[
                    style.button,
                    {marginTop: 30, marginBottom: 20}
                ]}
                onPress={()=>onPressButton()}
                >
                <Text
                    style={{
                        color:'#FAFAFA',
                        textAlign:'center'
                    }}
                    >{buttonLabel}</Text>
            </TouchableOpacity>
        
        </ScrollView>
    )

}

const style = StyleSheet.create({

    containerPhoto: {
        backgroundColor: '#039BE5',
        flex:1,
        justifyContent: 'center',
        marginBottom: 30,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },

    photo: {
            width:150,
            height:150, 
            resizeMode: 'cover',
            alignSelf:'center',
            marginTop:50,
            borderRadius:10,
            borderColor:'white'
    },

    spinnerTextStyle: {
        color: '#FFF'
    },

    textInput: {
        ...Input.standard,
        marginLeft: 10,
        marginRight: 10,
    }, 

    button: {
        ...Button.standard,
        marginLeft: 10,
        marginRight: 10
    },

    label: {
        ...Label.standard,
        marginTop: 2,
        marginLeft: 5, 
        marginBottom: 8
    },

    icon: {
        marginLeft:10
    }

})
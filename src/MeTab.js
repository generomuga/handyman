import React, { useEffect, useState } from 'react';

import { 
    View, 
    Text, 
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';

import * as firebase from 'firebase';

import database from './functions/database';

import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';

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
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [3, 3],
                quality: 1,
              });
    
              if (!result.cancelled) {
                uploadImage(result.uri,'test')
              }
        }
    }

    const uploadImage = async(uri, imageName) => {
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
    }


    return (
        <ScrollView
            // style={{flex:1}}
            >

            <View
                style={{
                    backgroundColor: '#039BE5',
                    flex:1,
                    justifyContent: 'center'
                }}
                >
                <Image 
                    style={{
                        width:100,
                        height:100,
                        resizeMode:'contain', 
                        alignSelf:'center',
                        marginTop:20,
                        // alignItems:'',
                        borderRadius:10,
                    }}
                    source={{uri:photoURL?photoURL:Image.resolveAssetSource(require('../assets/user.png')).uri}}
                />

                <Text
                    style={{
                        alignSelf:'center',
                        marginTop:10,
                        marginBottom:20,
                        color:'white'
                    }}
                    onPress={()=>{
                        onImagePress()
                    }}>
                    Change photo
                </Text>

            </View>

            <Text
                style={{
                    marginTop:10,
                    marginLeft:10, 
                    marginBottom:5, 
                    fontSize:17
                }}
            >
                Full name
            </Text>

            <TextInput 
                style={{
                    marginLeft:10,
                    marginRight:10, 
                    marginBottom:5,
                    borderWidth:1, 
                    padding:8, 
                    borderRadius:10, 
                    textAlign:'left',
                    color:'#424242',
                    borderColor:'#039BE5'
                }} 
                placeholder='full name' 
                autoCapitalize='none'
                value={displayName?displayName:null}
                editable={isDisplayNameEditable}
                onChangeText={displayName => setDisplayName(displayName)}
                />

            <Text
                style={{
                    marginTop:10,
                    marginLeft:10, 
                    marginBottom:5, 
                    fontSize:17
                }}
            >
                Gender
            </Text>

            <RNPickerSelect
                onValueChange={(value) => {
                    setGender(value)
                }}
                items={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                ]}
                disabled={!isGenderEditable}
            >
                <Text
                    style={{
                        marginLeft:10,
                        marginRight:10, 
                        marginBottom:5,
                        borderWidth:1, 
                        padding:8, 
                        borderRadius:10, 
                        textAlign:'left',
                        color:'#424242',
                        borderColor:'#039BE5',
                    }}
                >{gender?gender:'Select an item...'}</Text>
            </RNPickerSelect>

            <Text
                style={{
                    marginTop:10,
                    marginLeft:10, 
                    marginBottom:5, 
                    fontSize:17
                }}
            >
                Email address
            </Text>

            <TextInput 
                style={{
                    marginLeft:10,
                    marginRight:10, 
                    marginBottom:5,
                    borderWidth:1, 
                    padding:8, 
                    borderRadius:10, 
                    textAlign:'left',
                    color:'#424242',
                    borderColor:'#039BE5'
                }} 
                placeholder='email' 
                autoCapitalize='none' 
                value={email?email:null}
                editable={isEmailEditable}
                onChangeText={email => setEmail(email)}
                />

            <Text
                style={{
                    marginTop:10,
                    marginLeft:10, 
                    marginBottom:5, 
                    fontSize:17
                }}
            >
                Contact number</Text>

            <TextInput 
                style={{
                    marginLeft:10,
                    marginRight:10, 
                    marginBottom:5,
                    borderWidth:1, 
                    padding:8, 
                    borderRadius:10, 
                    textAlign:'left',
                    color:'#424242',
                    borderColor:'#039BE5'
                }} 
                placeholder='contact number' 
                autoCapitalize='none' 
                value={contactNo?contactNo:null}
                editable={isContactNoEditable}
                onChangeText={contactNo => setContactNo(contactNo)}
                />

            <Text
                style={{
                    marginTop:10,
                    marginLeft:10, 
                    marginBottom:5, 
                    fontSize:17
                }}
            >
                Home address
            </Text>

            <TextInput 
                style={{
                    marginLeft:10,
                    marginRight:10, 
                    marginBottom:5,
                    borderWidth:1, 
                    padding:8, 
                    borderRadius:10, 
                    textAlign:'left',
                    color:'#424242',
                    borderColor:'#039BE5'
                }} 
                placeholder='address' 
                autoCapitalize='none' 
                multiline={false}
                value={address?address:null}
                editable={isAddressEditable}
                onChangeText={address => setAddress(address)}
                />

            <TouchableOpacity 
                style={{
                    marginLeft:10,
                    marginRight:10,
                    marginBottom:10,
                    marginTop:20,
                    backgroundColor:'#039BE5',
                    padding:18,
                    borderRadius:10
                }}
                onPress={()=>onPressButton()}
                >
                <Text
                    style={{
                        color:'#FAFAFA',
                        textAlign:'center'
                    }}
                    >{buttonLabel}</Text>
            </TouchableOpacity>

            {/* <Button 
                onPress={()=>
                        props.navigation.navigate('Admin') 
                }
                title="Eheh"
            />  */}
        
        </ScrollView>
    )

}
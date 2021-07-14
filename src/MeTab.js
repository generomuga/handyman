import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    SafeAreaView, 
    Button,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';

import * as firebase from 'firebase';

import database from './functions/database';

import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';

database.init();

const dbRef = firebase.database().ref();

export default class MeTab extends Component {
        
    getUserDetails() {
        
        const user = firebase.auth().currentUser;

        dbRef.child("users").child(user['uid']).once("value")
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.setState({displayName:data['displayName']});
                    this.setState({gender:data['gender']});
                    this.setState({email:data['email']});
                    this.setState({photoURL:data['photoURL']});
                    this.setState({contactNo:data['contactNo']});
                    this.setState({address:data['address']});
                } 
                else {
                    console.log("No data available");
                }
            });
    }

    updateUserDetails() {
        const user = firebase.auth().currentUser;
        
        var updates = {};
        updates['displayName'] = this.state.displayName;
        updates['gender'] = this.state.gender;
        updates['contactNo'] = this.state.contactNo;
        updates['address'] = this.state.address;

        dbRef.child("users").child(user['uid']).update(updates);
    }

    _onPressButton() {
     
        const {isDisplayNameEditable, buttonLabel } = this.state;

        if (isDisplayNameEditable === true) {
            this.setState({isDisplayNameEditable:false});
            this.setState({isGenderEditable:false});
            this.setState({isContactNoEditable:false});
            this.setState({isAddressEditable:false});

            this.setState({buttonLabel:'Edit'});

            this.updateUserDetails();
            
        }
        else {
            this.setState({isDisplayNameEditable:true});
            this.setState({isGenderEditable:true});
            this.setState({isContactNoEditable:true});
            this.setState({isAddressEditable:true});

            this.setState({buttonLabel:'Save'})
            
        }

    }

    componentDidMount() {
        this.getUserDetails()
    }    

    constructor(props){
        super(props)

        this.state = {
            photoURL: '',
            displayName: '',
            gender:'',
            email: '',
            contactNo: '',
            address: '',
            isDisplayNameEditable: false,
            isGenderEditable: false,
            isEmailEditable: false,
            isContactNoEditable: false,
            isAddressEditable: false,
            buttonLabel: 'Edit'
        }

    }

    onImagePress = async() => {
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
                this.uploadImage(result.uri,'test')
                console.log(result.uri)
               
              }
        }

    }

    uploadImage = async(uri, imageName) => {
        const response = await fetch(uri)
        const blob = await response.blob()

        const user = firebase.auth().currentUser;

        var ref = firebase.storage().ref().child('images/'+user['uid']);
        await ref.put(blob)

        const photoURL = await ref.getDownloadURL()
        
        var updates = {}
        updates['photoURL'] = photoURL
        
        dbRef.child('users').child(user['uid']).update(updates)
        this.setState({photoURL:photoURL})
    }


    render(){
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
                        source={{uri:this.state.photoURL?this.state.photoURL:Image.resolveAssetSource(require('../assets/user.png')).uri}}
                        // source={{uri:Image.resolveAssetSource(require('../assets/user.png')).uri}}
                    />

                    <Text
                        style={{
                            alignSelf:'center',
                            marginTop:10,
                            marginBottom:20,
                            color:'white'
                        }}
                        onPress={()=>{
                            this.onImagePress()
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
                    value={this.state.displayName?this.state.displayName:null}
                    editable={this.state.isDisplayNameEditable}
                    onChangeText={displayName => this.setState({displayName})}
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
                        console.log(value);
                        this.setState({gender:value});
                    }}
                    items={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },
                    ]}
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
                    >{this.state.gender?this.state.gender:'Select an item...'}</Text>
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
                    value={this.state.email?this.state.email:null}
                    editable={this.state.isEmailEditable}
                    onChangeText={email => this.setState({email})}
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
                    value={this.state.contactNo?this.state.contactNo:null}
                    editable={this.state.isContactNoEditable}
                    onChangeText={contactNo => this.setState({contactNo})}
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
                    value={this.state.address?this.state.address:null}
                    editable={this.state.isAddressEditable}
                    onChangeText={address => this.setState({address})}
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
                    onPress={()=>this._onPressButton()}
                    >
                    <Text
                        style={{
                            color:'#FAFAFA',
                            textAlign:'center'
                        }}
                        >{this.state.buttonLabel}</Text>
                </TouchableOpacity>

                <Button 
                    onPress={()=>
                            this.props.navigation.navigate('Admin') 
                    }
                    title="Eheh"
                />
            
            </ScrollView>
        )
    }

}
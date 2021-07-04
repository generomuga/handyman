import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    SafeAreaView, 
    Button,
    TouchableOpacity,
    Image
} from 'react-native';

import * as firebase from 'firebase';

import database from './functions/database';

import ModalDropdown from 'react-native-modal-dropdown';

database.init();

export default class MeTab extends Component {
        
    getUserDetails() {
        
        const dbRef = firebase.database().ref();
        const user = firebase.auth().currentUser;

        const userId = user['uid'];
        console.log(userId);


        dbRef.child("users").child(userId).get().then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();

              this.setState({displayName:data['displayName']});
              this.setState({gender:data['gender']});
              this.setState({email:data['email']});
              this.setState({photoURL:data['photoURL']});
              this.setState({contactNo:data['contactNo']});
              this.setState({address:data['address']});
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
    }

    updateUserDetails() {
        const dbRef = firebase.database().ref();
        const user = firebase.auth().currentUser;
        const userId = user['uid'];

        var updates = {};
        updates['displayName'] = this.state.displayName;
        updates['gender'] = this.state.gender;
        updates['contactNo'] = this.state.contactNo;
        updates['address'] = this.state.address;

        dbRef.child("users").child(userId).update(updates);

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

    render(){
        return (
            <SafeAreaView
                style={{flex:1}}
                >

                <View
                    style={{
                        flex: 0.3,
                        backgroundColor: '#039BE5'
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

                    <Text>
                        
                    </Text>

                </View>

                <TextInput 
                    style={{
                        alignSelf:'stretch',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        borderBottomLeftRadius: 15,
                        borderBottomRightRadius: 15,
                        borderWidth: 1,
                        borderColor: '#039BE5',
                        padding:10,
                        marginLeft:10,
                        marginRight:10,
                        textAlign:'center'
                    }} 
                    placeholder='full name' 
                    autoCapitalize='none'
                    value={this.state.displayName?this.state.displayName:null}
                    editable={this.state.isDisplayNameEditable}
                    onChangeText={displayName => this.setState({displayName})}
                    />

                <ModalDropdown 
                    style={{alignSelf:'center'}} 
                    defaultValue='Male'
                    options={['Male','Female']}
                    disabled={!this.state.isGenderEditable}
                    onSelect={(idx, value)=>{
                        this.setState({gender:value})
                    }}
                    >
                        <Text>{this.state.gender?this.state.gender:'Gender'}</Text>
                </ModalDropdown>

                <TextInput 
                    style={{alignSelf:'center'}} 
                    placeholder='email' 
                    autoCapitalize='none' 
                    value={this.state.email?this.state.email:null}
                    editable={this.state.isEmailEditable}
                    onChangeText={email => this.setState({email})}
                    />

                <TextInput 
                    style={{alignSelf:'center'}} 
                    placeholder='contact number' 
                    autoCapitalize='none' 
                    value={this.state.contactNo?this.state.contactNo:null}
                    editable={this.state.isContactNoEditable}
                    onChangeText={contactNo => this.setState({contactNo})}
                    />

                <TextInput 
                    style={{alignSelf:'center'}} 
                    placeholder='address' 
                    autoCapitalize='none' 
                    multiline={true}
                    value={this.state.address?this.state.address:null}
                    editable={this.state.isAddressEditable}
                    onChangeText={address => this.setState({address})}
                    />

                <TouchableOpacity 
                    style={{alignSelf:'center'}} 
                    onPress={()=>this._onPressButton()}
                    >
                    <Text>{this.state.buttonLabel}</Text>
                </TouchableOpacity>

            </SafeAreaView>
        )
    }

}
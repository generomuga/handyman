import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    SafeAreaView, 
    Button,
    TouchableOpacity
} from 'react-native';

import * as firebase from 'firebase';

import database from './functions/database';

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
              this.setState({email:data['email']});
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
        updates['contactNo'] = this.state.contactNo;
        updates['address'] = this.state.address;

        dbRef.child("users").child(userId).update(updates);

    }

    _onPressButton() {
     
        const {isDisplayNameEditable, buttonLabel } = this.state;

        if (isDisplayNameEditable === true) {
            this.setState({isDisplayNameEditable:false});
            this.setState({isContactNoEditable:false});
            this.setState({isAddressEditable:false});

            this.setState({buttonLabel:'Edit'});

            this.updateUserDetails();
            
        }
        else {
            this.setState({isDisplayNameEditable:true});
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
            displayName: '',
            email: '',
            contactNo: '',
            address: '',
            isDisplayNameEditable: false,
            isEmailEditable: false,
            isContactNoEditable: false,
            isAddressEditable: false,
            buttonLabel: 'Edit'
        }

    }

    render(){
        return (
            <SafeAreaView>

                <TextInput 
                    // style={style.textInput} 
                    placeholder='full name' 
                    autoCapitalize='none' 
                    value={this.state.displayName}
                    editable={this.state.isDisplayNameEditable}
                    onChangeText={displayName => this.setState({displayName})}
                    />

                <TextInput 
                    // style={style.textInput} 
                    placeholder='email' 
                    autoCapitalize='none' 
                    value={this.state.email}
                    editable={this.state.isEmailEditable}
                    onChangeText={email => this.setState({email})}
                    />

                <TextInput 
                    // style={style.textInput} 
                    placeholder='contact number' 
                    autoCapitalize='none' 
                    value={this.state.contactNo}
                    editable={this.state.isContactNoEditable}
                    onChangeText={contactNo => this.setState({contactNo})}
                    />

                <TextInput 
                    // style={style.textInput} 
                    placeholder='address' 
                    autoCapitalize='none' 
                    value={this.state.address}
                    editable={this.state.isAddressEditable}
                    onChangeText={address => this.setState({address})}
                    />

                <TouchableOpacity 
                    // style={style.touchButton}
                    onPress={()=>this._onPressButton()}
                    >
                    <Text>{this.state.buttonLabel}</Text>
                </TouchableOpacity>

            </SafeAreaView>
        )
    }

}
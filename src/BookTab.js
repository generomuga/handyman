import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as firebase from 'firebase';

export default class BookTab extends Component {
        
    componentDidMount(){
        const items = this.getList();
        this.setState({category:items});
    }

    constructor(props){
        super(props)

        this.state = {
            category: [],
        }

    }

    getList() {

        const dbRef = firebase.database().ref();

        var items = []
        dbRef.child('tenant/categories').get()                        
            .then(snapshot => {
                if (snapshot.exists()) {

                    snapshot.forEach(function(childsnap){
                        var key = childsnap.key;
                        var data = childsnap.val();
                        // var ref = db.child(key);
                        items.push(data);
                        // console.log(data);
                        console.log(items);
                    }
                    )}
                else {
                    console.log('user not found');
                }
            });

        console.log(items);
        return items;

    }

    render(){
        return (
            <View>
                <ModalDropdown 
                    defaultValue="Select category..."
                    options={this.state.category} >
                </ModalDropdown>

                <ModalDropdown 
                    defaultValue="Select service..."
                    options={['Service']} >
                </ModalDropdown>

                <ModalDropdown 
                    defaultValue="Payment method..."
                    options={['Service']} >
                </ModalDropdown>
            </View>
        )
    }

}
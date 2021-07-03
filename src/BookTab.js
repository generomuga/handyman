import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class BookTab extends Component {
        
    render(){
        return (
            <View>
                <ModalDropdown 
                    defaultValue="Select category..."
                    options={['1','2']} >
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
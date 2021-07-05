import React, { Component } from 'react';
import { View, Text, Button, SafeAreaView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

import * as firebase from 'firebase';

export default class BookTab extends Component {
        
    componentDidMount(){
        const listCategory = this.getCategoryList();
        this.setState({categories:listCategory});
    }

    constructor(props){
        super(props)

        this.state = {
            categories: [],
            services: [],
            categoryValue: '',
            serviceValue: '',
            paymentMethodValue:'',
            date: new Date(),
            setDate: new Date(),
            mode: 'date',
            setMode: 'date',
            show: false,
            setShow: false
        }
    }

    getCategoryList() {
        const dbRef = firebase.database().ref();

        var items = []
        dbRef.child('tenant/categories').get()                        
            .then(snapshot => {
                if (snapshot.exists()) {

                    snapshot.forEach(function(childsnap){
                        var key = childsnap.key;
                        var data = childsnap.val();
                        items.push({"label":data,"value":data});
                    }
                    )}
                else {
                    items.push('Wala pa po idol');
                    console.log('user not found');
                }
            });

        console.log('Categories'+items);
        return items;
    }

    getServiceList(category) {
        const dbRef = firebase.database().ref();

        var items = []

        dbRef.child('tenant/services/'+category+'/').get()                        
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap){
                        var key = childsnap.key;
                        var data = childsnap.val();
                        items.push({"label":data,"value":data});
                    }
                    )}
                else {
                    console.log('services not found');
                }
            });

        return items;
    }


    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        this.setState({setShow:(Platform.OS === 'ios')});
        this.setState({setDate:currentDate});
        console.log(selectedDate);
      };
    
    showMode = (currentMode) => {
        this.setState({setShow:true});
        this.setState({setMode:currentMode});
      };
    
    showDatepicker = () => {
        showMode('date');
      };
    
    showTimepicker = () => {
        showMode('time');
      };
    

    render(){
        return (
            <SafeAreaView>

                <RNPickerSelect
                    onValueChange={(value) => {
                        this.setState({categoryValue:value})
                        this.setState({serviceValue:''});
                        const listService = this.getServiceList(value);
                        this.setState({services:listService});
                        
                    }}
                    items={this.state.categories}
                >
                    <Text>{this.state.categoryValue?this.state.categoryValue:'Select an item...'}</Text>
                </RNPickerSelect>

                <RNPickerSelect
                    onValueChange={(value) => {
                        console.log(value);
                        this.setState({serviceValue:value});
                    }}
                    items={this.state.services}
                >
                    <Text>{this.state.serviceValue?this.state.serviceValue:'Select an item...'}</Text>
                </RNPickerSelect>

                <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.date}
                    mode={this.state.mode}
                    is24Hour={true}
                    display="default"
                    onChange={this.onChange}
                    themeVariant="light"
                    neutralButtonLabel="clear"
                    />

                <RNPickerSelect
                    onValueChange={(value) => {
                        console.log(value);
                        this.setState({paymentMethodValue:value});
                    }}
                    items={[
                        { label: 'Cash on service', value: 'Cash on service' }
                    ]}
                >
                    <Text>{this.state.paymentMethodValue?this.state.paymentMethodValue:'Select an item...'}</Text>
                </RNPickerSelect>
            
            </SafeAreaView>
        )
    }

}
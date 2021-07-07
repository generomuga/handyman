import React, { Component } from 'react';
import { View, Text, Button, SafeAreaView, TouchableOpacity} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from "react-native-modal-datetime-picker";

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

import * as firebase from 'firebase';

export default class BookTab extends Component {
        
    componentDidMount(){
        // const listCategory = this.getCategoryList();
        this.getCategoryList();
        // this.setState({categories:listCategory});
    }

    constructor(props){
        super(props)

        this.state = {
            categories: [],
            services: [],
            categoryValue: '',
            serviceValue: '',
            serviceDate: '',
            paymentMethodValue:'',
            date: new Date(),
            setDate: new Date(),
            mode: 'date',
            setMode: 'date',
            show: false,
            setShow: false,
            isDateTimePickerVisible: false,
        }

        // this.getCategoryList = this.getCategoryList.bind(this);
        // this.getServiceList = this.getServiceList.bind(this);
    }

    getCategoryList() {
        const dbRef = firebase.database().ref();

        var items = []
        dbRef.child('tenant/categories').once('value')                        
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap){
                        // var key = childsnap.key;
                        var data = childsnap.val();
                        items.push({"label":data,"value":data})
                    }
                );
                this.setState({categories:items})
            }
            });
    }

    getServiceList(category) {
        const dbRef = firebase.database().ref();

        var items = []

        dbRef.child('tenant/services/'+category+'/').once('value')                    
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap){
                        // var key = childsnap.key;
                        var data = childsnap.val();
                        items.push({"label":data,"value":data})
                    }
                );
                this.setState({services:items})
            }
            });
    }


    // onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate || this.state.date;
    //     this.setState({setShow:(Platform.OS === 'ios')});
    //     this.setState({setDate:currentDate});
    //     console.log(selectedDate);
    //   };
    
    // showMode = (currentMode) => {
    //     this.setState({setShow:true});
    //     this.setState({setMode:currentMode});
    //   };
    
    // showDatepicker = () => {
    //     showMode('date');
    //   };
    
    // showTimepicker = () => {
    //     showMode('time');
    //   };


    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
      };
     
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
    
    handleDatePicked = date => {
        console.log("A date has been picked: ", date);
        var d = String(date).split(' ');
        var day = d[0];
        var month = d[1];
        var dayn = d[2];
        var year = d[3];
        var displayDate = month+' '+dayn+' '+year+', '+day
        this.setState({serviceDate:displayDate})
        this.hideDateTimePicker();
    };
    
    render(){
        return (
            <SafeAreaView>

                <RNPickerSelect
                    onValueChange={(value) => {
                        this.setState({categoryValue:value})
                        // this.setState({serviceValue:''});
                        this.getServiceList(value);
                        // const listService = this.getServiceList(value);
                        // this.setState({services:listService});
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

                {/* <DateTimePicker
                    style={{width:'100%', backgroundColor: 'white', position: 'absolute', bottom: 0, zIndex: 10}}
                    testID="dateTimePicker"
                    value={this.state.date}
                    mode={this.state.mode}
                    is24Hour={true}
                    display="spinner"
                    onChange={this.onChange}
                    themeVariant="light"
                    neutralButtonLabel="clear"
                    /> */}

                <Text>{this.state.serviceDate?this.state.serviceDate:null}</Text>
                <Button title="Set date of service" onPress={this.showDateTimePicker} />

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    display="default"
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

                <TouchableOpacity 
                        // style={{}}
                        // onPress={()=>this._onLoginPress()}
                        >
                        <Text>Add service</Text>
                    </TouchableOpacity>
            
            </SafeAreaView>
        )
    }

}
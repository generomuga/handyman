import React, { Component } from 'react';
import { View, Text, Button} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as firebase from 'firebase';
import { SafeAreaView } from 'react-navigation';
import { event } from 'react-native-reanimated';

import RNPickerSelect from 'react-native-picker-select';

export default class BookTab extends Component {
        
    componentDidMount(){
        const listCategory = this.getCategoryList();
        this.setState({categories:listCategory});

        // const listService = this.getServiceList('Repair');
        // this.setState({services:listService});
        console.log(listCategory);

        // const newLocal = this;
        // newLocal.list.scrollToIndex({ index: this.props.scrollToIndex || 0 });
    }

    constructor(props){
        super(props)

        this.state = {
            categories: [],
            services: [],
            categoryValue: 'SELECT',
            serviceValue: 'SELECT',
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
                        // var ref = db.child(key );
                        // items.push(data);
                        items.push({"label":data,"value":data});
                        // console.log(data);
                        // console.log(items);
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
                        // var ref = db.child(key );
                        console.log('Laman',data);
                        // items.push(data);
                        items.push({"label":data,"value":data});
                        // console.log("label":data,"value":data);
                        // console.log(items);
                    }
                    )}
                else {
                    // this.setState({services:['Wala eh']});
                    // iitems.push({"label":data,"value":data});
                    console.log('services not found');
                }
            });

        // console.log(items)
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
                    // console.log('Vale',String(this.state.categories[idx]));
                    this.setState({categoryValue:value})
                    this.setState({serviceValue:''});
                    const listService = this.getServiceList(value);
                    this.setState({services:listService});
                    
                }}
                items={this.state.categories}
            >
                <Text>{this.state.categoryValue?this.state.categoryValue:'[Select category]'}</Text>
            </RNPickerSelect>

            <RNPickerSelect
                onValueChange={(value) => {
                    console.log(value);
                    this.setState({serviceValue:value});
                }}
                items={this.state.services}
            >
                <Text>{this.state.serviceValue?this.state.serviceValue:'[Select service]'}</Text>
            </RNPickerSelect>

                {/* <ModalDropdown 
                    // defaultValue='Select category'
                    options={this.state.categories} 
                    onSelect={(idx, value)=>{
                                console.log('Vale',String(this.state.categories[idx]));
                                this.setState({categoryValue:value})
                                const listService = this.getServiceList(String(this.state.categories[idx]));
                                this.setState({services:listService});
                                this.setState({serviceValue:''});
                            }
                        }
                    >
                        <Text>{this.state.categoryValue?this.state.categoryValue:'[Select category]'}</Text>
                </ModalDropdown> */}

                {/* <ModalDropdown 
                    // defaultValue={this.state.services[0]}
                    options={this.state.services} 
                    //  ref={(ref)=> this.state.services = ref}
                    onSelect={(idx, value)=>{
                        this.setState({serviceValue:value})
                    }} 
                    >
                        <Text>{this.state.serviceValue?this.state.serviceValue:'[Select service]'}</Text>
                </ModalDropdown> */}
                
                <DateTimePicker
                    testID="dateTimePicker"
                    value={this.state.date}
                    mode={this.state.mode}
                    is24Hour={true}
                    display="default"
                    onChange={this.onChange}
                    />

                {/* <ModalDropdown 
                    defaultValue="Payment method..."
                    options={['Cash on service']} >
                </ModalDropdown> */}

            

            </SafeAreaView>
        )
    }

}
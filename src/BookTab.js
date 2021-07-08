import React, { Component } from 'react';
import { View, Text, Button, SafeAreaView, TouchableOpacity, FlatList, Alert} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from "react-native-modal-datetime-picker";

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

import * as firebase from 'firebase';

export default class BookTab extends Component {
        
    componentDidMount(){
        this.getCategoryList();
        this.getTempBooking();
    }

    constructor(props){
        super(props)

        this.state = {
            categories: [],
            services: [],
            categoryValue: '',
            serviceValue: '',
            serviceDate: '',
            servicePrice: 0,
            serviceCurrency: 'php',
            totalServicePrice: 0,
            actualDate:'',
            paymentMethodValue:'',
            date: new Date(),
            setDate: new Date(),
            isDateTimePickerVisible: false,
            tempBookValue: [],
            errorMsg: ''
        }
    }

    getCategoryList() {
        const dbRef = firebase.database().ref();

        var items = []
        dbRef.child('tenant/categories').once("value")                      
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

        var items = [];
        var price = 0;
        var currency = 'php';
        var isAvailable = false;
        var name = '';

        dbRef.child('tenant/services/'+category+'/').once("value")                  
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap){
                        // var key = childsnap.key;
                        // var data = childsnap.val();
                        name = childsnap.val()['name']
                        price = childsnap.val()['price']
                        currency = childsnap.val()['currency']
                        isAvailable = childsnap.val()['isAvailable']
                        console.log(name, price, currency, isAvailable)

                        if (isAvailable === true) {
                            items.push({"label":name,"value":name})
                        }

                    }
                );
                this.setState({serviceCurrency:currency})
                this.setState({servicePrice:price})
                this.setState({services:items})
            }
            });
    }

    getTempBooking(){
        const dbRef = firebase.database().ref();
        const user = firebase.auth().currentUser;

        var items = []
        var id = ''
        var category = ''
        var service = ''
        var service_date = ''
        var service_price = 0
        var service_currency = ''
        var totalPrice = 0

        dbRef.child('bookings/'+user['uid']).get()                        
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap){
                        // var key = childsnap.key;
                        id = childsnap.val()['id']
                        category = childsnap.val()['category']
                        service = childsnap.val()['service']
                        service_date = childsnap.val()['service_date']
                        service_price = childsnap.val()['service_price']
                        service_currency = childsnap.val()['service_currency']

                        totalPrice = totalPrice + service_price;

                        items.push({
                            id:id,
                            category:category,
                            service:service,
                            service_date:service_date,
                            service_price:service_price,
                            service_currency:service_currency
                        })
                    }
                );
                console.log("total",totalPrice);
                this.setState({tempBookValue:items})
                this.setState({totalServicePrice:totalPrice})
            }
            else {
                this.setState({tempBookValue:null})
                this.setState({totalServicePrice:0})
            }
            });
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
      };
     
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
    
    handleDatePicked = date => {
        this.setState({actualDate:date});
        console.log("A date has been picked: ", this.state.actualDate);
        var d = String(date).split(' ');
        var day = d[0];
        var month = d[1];
        var dayn = d[2];
        var year = d[3];
        var displayDate = month+' '+dayn+' '+year+', '+day
        this.setState({serviceDate:displayDate})
        this.hideDateTimePicker();
    };
    
    renderItemComponent = (data) =>
        <View>
            <Text>{data.item.id}</Text>
            <Text>{data.item.category}</Text>
            <Text>{data.item.service}</Text>
            <Text>{data.item.service_date}</Text>
            <Text>{String(data.item.service_currency).toUpperCase()}</Text>
            <Text>{data.item.service_price}</Text>
            {/* <Text>{data.item.id}</Text> */}
            <Button title="Delete" onPress={()=>{
                const dbRef = firebase.database().ref();
                const user = firebase.auth().currentUser;

                var items = []
                dbRef.child('bookings/'+user['uid']+'/'+data.item.id).remove()                     
                    .then(()=>{
                        console.log("DELETED");
                        
                        const filteredData = this.state.tempBookValue.filter(item => item.id !== id);
                        this.setState({ tempBookValue: filteredData });
                        
                    })
                this.getTempBooking();
            }}/>
        </View>

    render(){
        return (
            <SafeAreaView>

                <Text>{this.state.errorMsg}</Text>

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
                        onPress={()=>{

                            this.setState({errorMsg:''})

                            // console.log("date",this.state.serviceDate);  
                            if (this.state.categoryValue===null){
                                console.log("Di pde");
                                this.setState({errorMsg:"* Please select category"})
                                return
                            }
                            else if (this.state.serviceValue===null){
                                console.log("Di pde");
                                this.setState({errorMsg:"* Please select service"})
                                return
                            }
                            else if (this.state.serviceDate===''){
                                console.log("Di pde");
                                this.setState({errorMsg:"* Please select date of service"})
                                return
                            }
                            else if (this.state.actualDate.getTime() <= new Date().getTime()){
                                console.log("Awit di pde");
                                this.setState({errorMsg:"* Please select valid date of service"})
                                return
                            }
                            else 
                            {
                                const user = firebase.auth().currentUser;
                                var id = new Date().getTime().toString();   
                                firebase
                                    .database()
                                    .ref('bookings/' + user['uid'] +'/'+ id)
                                    .set({
                                        id:id,
                                        category:this.state.categoryValue,
                                        service:this.state.serviceValue,
                                        service_date:this.state.serviceDate,
                                        service_price:this.state.servicePrice,
                                        service_currency:this.state.serviceCurrency
                                    });

                                this.getTempBooking();
                            }
                        }}
                        >
                        <Text>Add service</Text>
                    </TouchableOpacity>
            
                    
                    {/* <TouchableOpacity 
                        // style={{}}
                        onPress={()=>{
                            this.getTempBooking();
                        }}
                        >
                        <Text>Refresh</Text>
                    </TouchableOpacity> */}

                    <FlatList
                        data={this.state.tempBookValue?this.state.tempBookValue:null}
                        renderItem={item => this.renderItemComponent(item)}
                        keyExtractor={item => item.id.toString()}
                        // ItemSeparatorComponent={this.ItemSeparator}
                        // refreshing={this.state.refreshing}
                        // onRefresh={this.handleRefresh}
                            />

                    <Text>Total price: {this.state.totalServicePrice?this.state.totalServicePrice:0}</Text>

            </SafeAreaView>
        )
    }

}
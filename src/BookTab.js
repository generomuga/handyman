import React, { Component } from 'react';
import { View, Text, Button, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Alert} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from "react-native-modal-datetime-picker";

import { AntDesign } from '@expo/vector-icons'; 

import ToggleSwitch from 'toggle-switch-react-native'

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Unhandled Promise Rejection']);
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

import * as firebase from 'firebase';
import { TextInput } from 'react-native-gesture-handler';
import { add } from 'react-native-reanimated';

export default class BookTab extends Component {
        
    componentDidMount(){
        this.getCategoryList();
        this.getTempBooking();
        this.getDefaultAddress();
        this.getDefaultContactNo();
    }

    constructor(props){
        super(props)

        this.state = {
            categories: [],
            services: [],
            categoryValue: '',
            serviceValue: '',
            serviceDate: '',
            servicePrice: 0.00,
            address:'',
            contactNo:'',
            serviceCurrency: 'php',
            totalServicePrice: 0.00,
            totalReserveService: 0,
            actualDate:'',
            paymentMethodValue:'',
            date: new Date(),
            setDate: new Date(),
            isDateTimePickerVisible: false,
            isUseDefaultAddress: true,
            isUseDefaultContact: true,
            isVisible: true,
            isAddressEditable: false,
            isContactEditable: false,
            tempBookValue: [],
            errorMsg: '',
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
        var totalReserveService = 0
        var is_use_default_address = true
        var contact_no = ''
        var is_visible = false
        // var is_address_editable = false
        // var address = ''

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
                        address = childsnap.val()['address']
                        contact_no = childsnap.val()['contact_no']
                        is_visible = childsnap.val()['is_visible']
                        // is_use_default_address = childsnap.val()['is_use_default_address']
                        // is_address_editable = childsnap.val()['is_address_editable']
                        // address = childsnap.val()['address']

                        console.log(is_visible,'he')

                        if (is_visible === true) {

                            totalPrice = totalPrice + service_price;
                            totalReserveService = totalReserveService + 1

                            items.push({
                                id:id,
                                category:category,
                                service:service,
                                service_date:service_date,
                                service_price:service_price,
                                service_currency:service_currency,
                                address:address,
                                contact_no:contact_no,
                                isVisible:is_visible
                            })
                        }

                    }
                );
                console.log("total",totalPrice);
                this.setState({tempBookValue:items})
                this.setState({totalServicePrice:totalPrice})
                this.setState({totalReserveService:totalReserveService})
            }
            else {
                this.setState({tempBookValue:null})
                this.setState({totalServicePrice:0})
                this.setState({totalReserveService:0})
            }
            });
    }

    getDefaultAddress() {
        
        const dbRef = firebase.database().ref();
        const user = firebase.auth().currentUser;

        const userId = user['uid'];
        console.log(userId);

        dbRef.child("users").child(userId).get().then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();

            //   this.setState({displayName:data['displayName']});
            //   this.setState({gender:data['gender']});
            //   this.setState({email:data['email']});
            //   this.setState({photoURL:data['photoURL']});
            //   this.setState({contactNo:data['contactNo']});
              this.setState({address:data['address']});
            //   this.setState({contact:data['contact']});
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
    }

    getDefaultContactNo() {
        
        const dbRef = firebase.database().ref();
        const user = firebase.auth().currentUser;

        const userId = user['uid'];
        console.log(userId);

        dbRef.child("users").child(userId).get().then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();

            //   this.setState({displayName:data['displayName']});
            //   this.setState({gender:data['gender']});
            //   this.setState({email:data['email']});
            //   this.setState({photoURL:data['photoURL']});
              this.setState({contactNo:data['contactNo']});
            //   this.setState({address:data['address']});
            //   this.setState({contact:data['contact']});
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
    }

    updateBookingDetails() {
        const dbRef = firebase.database().ref();
        const user = firebase.auth().currentUser;

        var id = ''
        var category = ''
        var service = ''
        var service_date = ''
        var service_price = 0
        var service_currency = ''
        var contact_no = ''
        var is_visible = false

        var trasaction_id = new Date().getTime().toString();   
        var refTrans = dbRef
                    .child('transactions/'+user['uid'])
                    .child(trasaction_id);
                    // .set({
                    //     trasaction_id:id
                    // })

        // var counter = 0;
        var items = []

        var created_at = new Date().toString();

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
                        address = childsnap.val()['address']
                        contact_no = childsnap.val()['contact_no']
                        is_visible = childsnap.val()['is_visible']
                      
                        console.log(id)
                        if (is_visible === true) {
                            var updates = {}
                            updates['is_visible'] = false
                            var refUpdate = dbRef.child('bookings/'+user['uid']).child(id).update(updates);
                            
                            items.push(id)  
                        }

                    }
                );
                
                refTrans.set({
                    booking_id:items,
                    total_price: this.state.totalServicePrice,
                    created_at: created_at,
                    service_currency: this.state.serviceCurrency
                })
            }

            else {
               
            }
            this.getTempBooking()
            }
            );
               
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
       
        // return (
        <View style={{
                backgroundColor:'white', 
                borderRadius:10, 
                borderWidth:2, 
                borderColor:'#F44336',
                marginLeft: 20, 
                marginRight: 20,
                marginBottom:10,
                flex:1,
                justifyContent:'center'
            }}
            >
            <AntDesign 
                style={{textAlign:'right', position:'relative', marginTop:5, marginRight:5}}
                name="closecircle" 
                size={24} 
                color="#F44336" 
                onPress={()=>{
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
                }}
                />
            
            <Text 
                style={{
                    marginLeft:10,
                    fontWeight:'bold'
                }}
            >Ref no. HHP{data.item.id}</Text>
            
            <Text
                style={{
                    marginLeft:10,
                    fontWeight:'400'
                }}
            >Category: {data.item.category}</Text>
            
            <Text
                style={{
                    marginLeft:10,
                    fontWeight:'400'
                }}
            >Service: {data.item.service}</Text>
            
            <Text
                style={{
                    marginLeft:10,
                    fontWeight:'400'
                }}
                >Date of service: {data.item.service_date}</Text>

            <Text
                style={{
                    marginLeft:10,
                    fontWeight:'400'
                }}
                >Contact: {data.item.contact_no}</Text>

            <Text
                style={{
                    marginLeft:10,
                    fontWeight:'400'
                }}
                >Address: {data.item.address}</Text>
            
            <Text
                style={{
                    marginLeft:10,
                    fontWeight:'400',
                    marginBottom:10
                }}>Price: {data.item.service_currency} {data.item.service_price.toFixed(2)}</Text>
          
        </View>

    render(){
        return (
            <SafeAreaView style={{flex:1, backgroundColor:'white'}}>

                <ScrollView>
                {/* <View> */}
                    <Text
                        style={{
                            color:'#C62828',
                            textAlign:'center',
                            padding:5
                        }}
                    >{this.state.errorMsg}</Text>

                    <View style={{backgroundColor:"white", justifyContent:'center'}}>
                        <Text style={{
                            marginTop:10,
                            marginLeft:10, 
                            marginBottom:5, 
                            fontSize:17
                            }}>Category</Text>

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
                            <Text style={{
                                marginLeft:10,
                                marginRight:10, 
                                marginBottom:5,
                                borderWidth:1, 
                                padding:8, 
                                borderRadius:10, 
                                textAlign:'left',
                                color:'#424242',
                                borderColor:'#039BE5',
                                }}>
                                {this.state.categoryValue?this.state.categoryValue:'Select an item...'}
                            </Text>
                        </RNPickerSelect>

                    </View>

                    <View style={{backgroundColor:"white", justifyContent:'center'}}>
                        <Text style={{
                            marginTop:10,
                            marginLeft:10, 
                            marginBottom:5, 
                            fontSize:17
                            }}>Service</Text>
                        <RNPickerSelect
                            onValueChange={(value) => {
                                console.log(value);
                                this.setState({serviceValue:value});
                            }}
                            items={this.state.services}
                        >
                            <Text style={{
                                marginLeft:10,
                                marginRight:10, 
                                marginBottom:5,
                                borderWidth:1, 
                                padding:8, 
                                borderRadius:10, 
                                textAlign:'left',
                                color:'#424242',
                                borderColor:'#039BE5',
                                }}>{this.state.serviceValue?this.state.serviceValue:'Select an item...'}</Text>
                        </RNPickerSelect>

                    </View>
                    
                    <View style={{backgroundColor:"white", justifyContent:'center'}}>
                        <Text style={{
                            marginTop:10,
                            marginLeft:10, 
                            marginBottom:5, 
                            fontSize:17
                            }}>Date of service</Text>
                        <Text 
                            style={{
                                marginLeft:10,
                                marginRight:10, 
                                marginBottom:15,
                                borderWidth:1, 
                                padding:8, 
                                borderRadius:10, 
                                textAlign:'left',
                                color:'#424242',
                                borderColor:'#039BE5'
                                }}
                            onPress={this.showDateTimePicker}
                                >{this.state.serviceDate?this.state.serviceDate:"Not set"}</Text>
                        
                        {/* <Button title="Set date of service" onPress={this.showDateTimePicker} /> */}
                        {/* <TouchableOpacity 
                            style={{marginLeft:10}}
                            onPress={this.showDateTimePicker}
                            >
                            <Text>Set date of service</Text>
                        </TouchableOpacity> */}

                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            display="default"
                            />
                    </View>

                    <View>
                        <ToggleSwitch
                            // style={{marginLeft:10}}
                            isOn={this.state.isUseDefaultAddress}
                            onColor="green"
                            label='Use default address'
                            labelStyle={{ 
                                marginLeft:10, 
                                marginBottom:5, 
                                fontSize:17 }}
                            offColor="red"
                            size="small"
                            onToggle={()=>{
                                this.getDefaultAddress();
                                this.setState({address:this.state.address})
                                console.log(this.state.address)

                                if (this.state.isUseDefaultAddress === true){
                                    this.setState({isUseDefaultAddress:false})
                                    this.setState({isAddressEditable:true})
                                    
                                }
                                else {
                                    this.setState({isUseDefaultAddress:true})
                                    this.setState({isAddressEditable:false})
                                }
                            }} 
                        />

                        <TextInput
                            style={{
                                marginLeft:10,
                                marginRight:10, 
                                marginBottom:15,
                                borderWidth:1, 
                                padding:8, 
                                borderRadius:10, 
                                textAlign:'left',
                                color:'#424242',
                                borderColor:'#039BE5'
                                }}
                            value={this.state.address}
                            // defaultValue={this.address}
                            editable={this.state.isAddressEditable}
                            onChangeText={(address)=>this.setState({address:address})}
                        />

                    </View>

                    <View>
                        <ToggleSwitch
                            // style={{marginLeft:10}}
                            isOn={this.state.isUseDefaultContact}
                            onColor="green"
                            label='Use default contact number'
                            labelStyle={{ 
                                marginLeft:10, 
                                marginBottom:5, 
                                fontSize:17 }}
                            offColor="red"
                            size="small"
                            onToggle={()=>{
                                this.getDefaultContactNo();
                                this.setState({contactNo:this.state.contactNo})
                                console.log(this.state.contactNo)

                                if (this.state.isUseDefaultContact === true){
                                    this.setState({isUseDefaultContact:false})
                                    this.setState({isContactEditable:true})
                                    
                                }
                                else {
                                    this.setState({isUseDefaultContact:true})
                                    this.setState({isContactEditable:false})
                                }
                            }} 
                        />

                        <TextInput
                            style={{
                                marginLeft:10,
                                marginRight:10, 
                                marginBottom:15,
                                borderWidth:1, 
                                padding:8, 
                                borderRadius:10, 
                                textAlign:'left',
                                color:'#424242',
                                borderColor:'#039BE5'
                                }}
                            value={this.state.contactNo}
                            // defaultValue={this.address}
                            editable={this.state.isContactEditable}
                            onChangeText={(contactNo)=>this.setState({contactNo:contactNo})}
                        />

                    </View>

                    <View style={{justifyContent:'center', backgroundColor:'white'}}>
                        <TouchableOpacity 
                            style={{
                                marginLeft:10,
                                marginRight:10,
                                marginBottom:10,
                                backgroundColor:'#039BE5',
                                padding:18,
                                borderRadius:10
                            }}
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
                                    this.setState({isVisible:true});
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
                                            service_currency:this.state.serviceCurrency,
                                            address:this.state.address,
                                            contact_no:this.state.contactNo,
                                            is_visible:this.state.isVisible
                                            // is_use_default_address:this.state.isUseDefaultAddress,
                                            // is_address_editable:this.state.isAddressEditable,
                                            // address:'Default address'
                                        });

                                    this.getTempBooking();
                                }
                            }}
                            >

                            <Text 
                                style={{
                                    color:'#FAFAFA',
                                    textAlign:'center'
                                }}>Add service</Text>

                        </TouchableOpacity>

                    </View>
                    
                    <View>
                        <Text
                            style={{
                                marginTop:10,
                                marginLeft:10, 
                                marginBottom:10, 
                                fontSize:17
                                }}
                            >Total Services Reserved ({this.state.totalReserveService})</Text>

                        <FlatList
                            data={this.state.tempBookValue?this.state.tempBookValue:null}
                            renderItem={item => this.renderItemComponent(item)}
                            keyExtractor={item => item.id.toString()}
                            // ItemSeparatorComponent={this.ItemSeparator}
                            // refreshing={this.state.refreshing}
                            // onRefresh={this.handleRefresh}
                                />
                    </View>

                    <View>
                        <Text style={{
                            marginTop:10,
                            marginLeft:10, 
                            marginBottom:5, 
                            fontSize:17
                            }}>Total price: Php {this.state.totalServicePrice.toFixed(2)?this.state.totalServicePrice.toFixed(2):0}</Text>

                        <Text style={{
                            marginTop:10,
                            marginLeft:10, 
                            marginBottom:5, 
                            fontSize:17
                            }}>Payment method</Text>

                        <RNPickerSelect
                            onValueChange={(value) => {
                                console.log(value);
                                this.setState({paymentMethodValue:value});
                            }}
                            items={[
                                { label: 'Cash', value: 'Cash' }
                            ]}
                        >
                            <Text style={{
                                marginLeft:10,
                                marginRight:10, 
                                marginBottom:20,
                                borderWidth:1, 
                                padding:8, 
                                borderRadius:10, 
                                textAlign:'left',
                                color:'#424242',
                                borderColor:'#039BE5',
                                }}>{this.state.paymentMethodValue?this.state.paymentMethodValue:'Select an item...'}</Text>
                        </RNPickerSelect>

                            
                        <TouchableOpacity 
                            style={{
                                marginLeft:10,
                                marginRight:10,
                                marginBottom:30,
                                backgroundColor:'#039BE5',
                                padding:18,
                                borderRadius:10
                            }}
                            onPress={()=>this.updateBookingDetails()}
                            >

                            <Text 
                                style={{
                                    color:'#FAFAFA',
                                    textAlign:'center'
                                }}>Book it now</Text>

                        </TouchableOpacity>
                        
                    </View>

                </ScrollView>
                {/* </View>         */}
            </SafeAreaView>
        )
    }

}
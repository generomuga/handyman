import React, { Component } from 'react';

import { 
    View, 
    Text, 
    SafeAreaView, 
    ScrollView, 
    TouchableOpacity, 
    FlatList
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from "react-native-modal-datetime-picker";
import ToggleSwitch from 'toggle-switch-react-native'

import { AntDesign } from '@expo/vector-icons'; 

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Unhandled Promise Rejection']);
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

import * as firebase from 'firebase';
import { TextInput } from 'react-native-gesture-handler';


const dbRef = firebase.database().ref();

export default class BookTab extends Component {
        
    componentDidMount(){
        this.getCategoryList();
        this.getServiceInfo();
        this.getDefaultAddress();
        this.getDefaultContactNo();
    }

    constructor(props){
        super(props)

        this.state = {
            categories: [],
            services: [],

            categoryCurrentVal: '',
            serviceCurrentVal: '',
            serviceDateCurrentVal: '',
            servicePrice: 0.00,
            address:'',
            contactNo:'',
            serviceCurrency: 'php',
            paymentMethodValue:'',
            actualDate:'',
            isVisible: true,

            totalServicePrice: 0.00,
            totalReserveService: 0,

            date: new Date(),

            isDateTimePickerVisible: false,
            isUseDefaultAddress: true,
            isUseDefaultContact: true,
            isAddressEditable: false,
            isContactEditable: false,

            serviceInfo: [],
            errorMsg: '',
        }
    }

    getCategoryList() {
        var items = []
        dbRef.child('tenant/categories').once("value")
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap) {
                        var data = childsnap.val()
                        items.push({"label":data,"value":data})
                    });
                    this.setState({categories:items})
                }
            });
    }

    getServiceList(category) {
        var items = [];
        var price = 0;
        var currency = 'Php';
        var isAvailable = false;
        var name = '';

        dbRef.child('tenant/services/'+category+'/').once("value")
            .then(snapshot => {
                if (snapshot.exists()) {
                        snapshot.forEach(function(childsnap) {
                            name = childsnap.val()['name']
                            price = childsnap.val()['price']
                            currency = childsnap.val()['currency']
                            isAvailable = childsnap.val()['isAvailable']
                        
                            if (isAvailable === true) {
                                items.push({"label":name,"value":name})
                            }
                        });
                    
                    this.setState({serviceCurrency:currency})
                    this.setState({servicePrice:price})
                    this.setState({services:items})
                }
            });
    }

    getServiceInfo(){
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
        var contact_no = ''
        var is_visible = false
        
        dbRef.child('bookings/'+user['uid']).get()                        
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap){
                        id = childsnap.val()['id']
                        category = childsnap.val()['category']
                        service = childsnap.val()['service']
                        service_date = childsnap.val()['service_date']
                        service_price = childsnap.val()['service_price']
                        service_currency = childsnap.val()['service_currency']
                        address = childsnap.val()['address']
                        contact_no = childsnap.val()['contact_no']
                        is_visible = childsnap.val()['is_visible']

                        if (is_visible === true) {
                            totalPrice = totalPrice + service_price
                            totalReserveService = totalReserveService + 1

                            items.push({
                                id, 
                                category,
                                service,
                                service_date,
                                service_price,
                                service_currency,
                                address,
                                contact_no,
                                is_visible
                            })
                        }
                    });
                
                    this.setState({serviceInfo:items})
                    this.setState({totalServicePrice:totalPrice})
                    this.setState({totalReserveService:totalReserveService})
                }
                else {
                    this.setState({serviceInfo:null})
                    this.setState({totalServicePrice:0})
                    this.setState({totalReserveService:0})
                }
            });
    }

    getDefaultAddress() {
        const user = firebase.auth().currentUser

        dbRef.child('users').child(user['uid']).get()
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    this.setState({address:data['address']})
                }
            })
    }

    getDefaultContactNo() {
        const user = firebase.auth().currentUser

        dbRef.child('users').child(user['uid']).get()
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    this.setState({contactNo:data['contactNo']})
                } 
            })
    }

    updateBookingDetails() {
        const user = firebase.auth().currentUser

        var id = ''
        var category = ''
        var service = ''
        var service_date = ''
        var service_price = 0
        var service_currency = ''
        var contact_no = ''
        var is_visible = false

        var trasaction_id = new Date().getTime().toString()
        var transactionRef = dbRef.child('transactions/'+user['uid']).child(trasaction_id)
                    
        var items = []
        var created_at = new Date().toString()

        dbRef.child('bookings/'+user['uid']).get()                        
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap) {
                        id = childsnap.val()['id']
                        category = childsnap.val()['category']
                        service = childsnap.val()['service']
                        service_date = childsnap.val()['service_date']
                        service_price = childsnap.val()['service_price']
                        service_currency = childsnap.val()['service_currency']
                        address = childsnap.val()['address']
                        contact_no = childsnap.val()['contact_no']
                        is_visible = childsnap.val()['is_visible']
                      
                        if (is_visible === true) {
                            var updates = {}
                            updates['is_visible'] = false
                            dbRef.child('bookings/'+user['uid']).child(id).update(updates);
                            items.push(id)
                        }
                    });
                
                    transactionRef.set({
                        booking_id:items,
                        total_price: this.state.totalServicePrice,
                        created_at: created_at,
                        service_currency: this.state.serviceCurrency
                    })
                }

                this.getServiceInfo()
            });   
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
      };
     
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
    
    handleDatePicked = date => {
        var parsed_date = String(date).split(' ');
        var day = parsed_date[0];
        var month = parsed_date[1];
        var dayn = parsed_date[2];
        var year = parsed_date[3];
        var displayDate = month+' '+dayn+' '+year+', '+day

        this.setState({actualDate:date});
        this.setState({serviceDateCurrentVal:displayDate})
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
                    const user = firebase.auth().currentUser;
    
                    var items = []
                    dbRef.child('bookings/'+user['uid']+'/'+data.item.id).remove()                     
                        .then(()=>{
                            console.log("DELETED");
                            
                            const filteredData = this.state.serviceInfo.filter(item => item.id !== id);
                            this.setState({ serviceInfo: filteredData });
                            
                        })
                    this.getServiceInfo();
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
                                this.setState({categoryCurrentVal:value})
                                // this.setState({serviceCurrentVal:''});
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
                                {this.state.categoryCurrentVal?this.state.categoryCurrentVal:'Select an item...'}
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
                                this.setState({serviceCurrentVal:value});
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
                                }}>{this.state.serviceCurrentVal?this.state.serviceCurrentVal:'Select an item...'}</Text>
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
                                >{this.state.serviceDateCurrentVal?this.state.serviceDateCurrentVal:"Not set"}</Text>
                        
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
                                // console.log("date",this.state.serviceDateCurrentVal);  
                                if (this.state.categoryCurrentVal===null){
                                    console.log("Di pde");
                                    this.setState({errorMsg:"* Please select category"})
                                    return
                                }
                                else if (this.state.serviceCurrentVal===null){
                                    console.log("Di pde");
                                    this.setState({errorMsg:"* Please select service"})
                                    return
                                }
                                else if (this.state.serviceDateCurrentVal===''){
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
                                            category:this.state.categoryCurrentVal,
                                            service:this.state.serviceCurrentVal,
                                            service_date:this.state.serviceDateCurrentVal,
                                            service_price:this.state.servicePrice,
                                            service_currency:this.state.serviceCurrency,
                                            address:this.state.address,
                                            contact_no:this.state.contactNo,
                                            is_visible:this.state.isVisible
                                            // is_use_default_address:this.state.isUseDefaultAddress,
                                            // is_address_editable:this.state.isAddressEditable,
                                            // address:'Default address'
                                        });

                                    this.getServiceInfo();
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
                            data={this.state.serviceInfo?this.state.serviceInfo:null}
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
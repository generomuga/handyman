import React, { Component } from 'react';

import { 
    View, 
    Text, 
    SafeAreaView, 
    ScrollView, 
    TouchableOpacity, 
    FlatList,
    StyleSheet
} from 'react-native';

import { 
    Background, 
    Button,
    InputText,
    Label
} from './styles';

import { MaterialIcons } from '@expo/vector-icons'; 

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
import Dialog from "react-native-dialog";

const dbRef = firebase.database().ref();

const dbRef2 = firebase.firestore();

import NotificationTab from './NotifcationTab';


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
            isBooked: false,
            status: 'pending',

            createdDate: '',

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

            isDialogVisible: false
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
        var is_booked = false
        var status = ''
        
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
                        is_booked = childsnap.val()['is_booked']
                        status = childsnap.val()['status']

                        console.log('status',status)

                        if (is_visible === true && is_booked === false) {
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
        var items_category = []
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
                            updates['is_booked'] = true
                            dbRef.child('bookings/'+user['uid']).child(id).update(updates);
                            items.push(id)
                            items_category.push({
                                id,
                                category,
                                service,
                                service_date,
                                service_price,
                                service_currency,
                                address
                            })
                        }
                    });
                
                    transactionRef.set({
                        // booking_id:items,
                        total_price: this.state.totalServicePrice,
                        created_at: created_at,
                        service_currency: this.state.serviceCurrency,
                        booking_info:items_category
                    })
                }

                this.getServiceInfo()
            });   
    }

    addServiceInfo() {
        const user = firebase.auth().currentUser;
        var id = new Date().getTime().toString();
           
        var dte = new Date().toString();

        dbRef.child('bookings/' + user['uid'] +'/'+ id)
            .set({
                id:id,
                category:this.state.categoryCurrentVal,
                service:this.state.serviceCurrentVal,
                service_date:this.state.serviceDateCurrentVal,
                service_price:this.state.servicePrice,
                service_currency:this.state.serviceCurrency,
                address:this.state.address,
                contact_no:this.state.contactNo,
                is_visible:this.state.isVisible,
                is_booked:this.state.isBooked,
                status:this.state.status,
                createdDate:dte
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
        <View style={{
                backgroundColor:'white', 
                borderRadius:10, 
                borderWidth:2, 
                borderColor:'#F44336',
                marginLeft: 20, 
                marginRight: 20,
                marginBottom:10,
                justifyContent:'center'
            }} >
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
        
            <View
                style={{flexDirection:'row'}} >

                <MaterialIcons 
                    style={{marginLeft:10}}
                    name="confirmation-number" 
                    size={24} color="#00695C" />

                <Text 
                    style={{
                        marginLeft:10,
                        fontWeight:'bold',
                        alignSelf: 'center'
                    }}
                >{data.item.id}</Text>
            </View>
            
            <View style={{flexDirection:'row'}}>
                <View 
                    style={{flexDirection:'row'}} >

                    <MaterialIcons 
                        style={{marginLeft:10}}
                        name="category" 
                        size={24} 
                        color="#E65100" />

                    <Text
                        style={{
                            marginLeft:10,
                            fontWeight:'400',
                            alignSelf: 'center'
                        }}>
                            {data.item.category}
                    </Text>

                </View>

                <View 
                    style={{flexDirection:'row'}} >
                    
                    <MaterialIcons 
                        style={{marginLeft:10}}
                        name="cleaning-services" 
                        size={24} 
                        color="#9E9D24" />
                    
                    <Text
                        style={{
                            marginLeft:10,
                            fontWeight:'400',
                            alignSelf: 'center'
                        }}> 
                        {data.item.service}
                    </Text>

                </View>

            </View>

            <View 
                style={{flexDirection:'row'}} >

                <View
                    style={{flexDirection:'row'}} >

                    <MaterialIcons 
                        style={{marginLeft:10}}
                        name="date-range" 
                        size={24} 
                        color="#0D47A1" />

                    <Text
                        style={{
                            alignSelf: 'center',
                            marginLeft:10,
                            fontWeight:'400'
                        }} >
                            {data.item.service_date}
                    </Text>

                </View>

                <View
                    style={{flexDirection:'row'}} >

                    <MaterialIcons 
                        style={{marginLeft:10}}
                        name="contact-phone" 
                        size={24} 
                        color="#2E7D32" />

                    <Text
                        style={{
                            alignSelf: 'center',
                            marginLeft:10,
                            fontWeight:'400'
                        }} >
                            {data.item.contact_no}
                    </Text>

                </View>

            </View>

            <View
                style={{flexDirection:'row'}} >
                
                <MaterialIcons 
                    style={{marginLeft:10}}
                    name="add-location" 
                    size={24} 
                    color="#B71C1C" />
                
                <Text
                    style={{
                        marginLeft:10,
                        fontWeight:'400',
                        alignSelf: 'center',
                    }} >
                        {data.item.address}
                </Text>

            </View>

            <View
                style={{
                    flexDirection: 'row',
                    marginBottom: 10
                }} >

                <MaterialIcons 
                    style={{marginLeft:10}}
                    name="attach-money" 
                    size={24} 
                    color="#424242" />

                <Text
                    style={{
                        marginLeft:10,
                        fontWeight:'400',
                        alignSelf: 'center'
                    }}>
                        {data.item.service_currency} {data.item.service_price.toFixed(2)}
                </Text>

            </View>
        </View>

    showDialog = () => {
        this.setState({isDialogVisible:true})
        console.log('Show')
    };

    handleCancel = () => {
        this.setState({isDialogVisible:false})
        console.log('Hide1')
    };

    handleProceed = () => {
        // The user has pressed the "Delete" button, so here you can do your own logic.
        // ...Your logic
        this.setState({isDialogVisible:false})
        this.updateBookingDetails()
        console.log('Hide2')

        // const notif = new NotificationTab;
        // notif.getServiceInfo()

        // this.setState({isBooked:true})
    };

    render(){
        return (
            <SafeAreaView
                style={{backgroundColor:'white'}} >

                <ScrollView>
                
                    <View 
                        style={style.viewErrorMessage} >

                        <Text
                            style={style.labelErrorMessage} >
                            {this.state.errorMsg}
                        </Text>
                        
                    </View>
                    
                    <View 
                        style={style.viewComponent} >

                        <Text 
                            style={style.labelComponent} >
                            Category
                        </Text>

                        <RNPickerSelect
                            onValueChange={(value) => {
                                this.setState({categoryCurrentVal:value})
                                this.setState({serviceCurrentVal:''})
                                this.setState({services:[]})
                                this.getServiceList(value)
                            }}
                            items={this.state.categories} >
                            
                            <Text 
                                style={style.labelComponentItem} >    
                                {this.state.categoryCurrentVal?this.state.categoryCurrentVal:'Select an item...'}
                            </Text>

                        </RNPickerSelect>

                    </View>

                    <View 
                        style={style.viewComponent} >

                        <Text 
                            style={style.labelComponent} >
                            Service
                        </Text>

                        <RNPickerSelect
                            onValueChange={(value) => {
                                this.setState({serviceCurrentVal:value});
                            }}
                            items={this.state.services} >

                            <Text 
                                style={style.labelComponentItem} >
                                {this.state.serviceCurrentVal?this.state.serviceCurrentVal:'Select an item...'}
                            </Text>

                        </RNPickerSelect>

                    </View>
                    
                    <View 
                        style={style.viewComponent} >
                            
                        <Text 
                            style={style.labelComponent} >
                            Date of service
                        </Text>

                        <Text 
                            style={style.labelComponentItem}
                            onPress={this.showDateTimePicker} >  
                            {this.state.serviceDateCurrentVal?this.state.serviceDateCurrentVal:"Not set"}
                        </Text>
                        
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            display="default" />

                    </View>

                    <View
                        style={style.viewComponent} >

                        <ToggleSwitch
                            isOn={this.state.isUseDefaultAddress}
                            onColor="green"
                            label='Use default address'
                            labelStyle={style.toggleLabel}
                            offColor="red"
                            size="small"
                            onToggle={()=>{
                                this.getDefaultAddress();
                                this.setState({address:this.state.address})

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
                            style={style.labelComponentItem}
                            multiline={false}
                            value={this.state.address}
                            placeholder={'Not set'}
                            editable={this.state.isAddressEditable}
                            onChangeText={(address)=>this.setState({address:address})} />

                    </View>

                    <View>

                        <ToggleSwitch
                            isOn={this.state.isUseDefaultContact}
                            onColor="green"
                            label='Use default contact number'
                            labelStyle={style.toggleLabel}
                            offColor="red"
                            size="small"
                            onToggle={()=>{
                                this.getDefaultContactNo();
                                this.setState({contactNo:this.state.contactNo})
                            
                                if (this.state.isUseDefaultContact === true){
                                    this.setState({isUseDefaultContact:false})
                                    this.setState({isContactEditable:true})
                                }
                                else {
                                    this.setState({isUseDefaultContact:true})
                                    this.setState({isContactEditable:false})
                                }
                            }} />

                        <TextInput
                            style={style.labelComponentItem}
                            value={this.state.contactNo}
                            placeholder={'Not set'}
                            editable={this.state.isContactEditable}
                            onChangeText={(contactNo)=>this.setState({contactNo:contactNo})}
                        />

                    </View>

                    <View 
                        style={style.viewComponent} >

                        <TouchableOpacity 
                            style={style.touchButton}
                            onPress={()=>{
                                this.setState({errorMsg:''})
                                if (this.state.categoryCurrentVal===null){
                                    this.setState({errorMsg:"* Please select category"})
                                    return
                                }
                                else if (this.state.serviceCurrentVal===null){
                                    this.setState({errorMsg:"* Please select service"})
                                    return
                                }
                                else if (this.state.serviceDateCurrentVal===''){
                                    this.setState({errorMsg:"* Please select date of service"})
                                    return
                                }
                                else if (this.state.actualDate.getTime() <= new Date().getTime()){
                                    this.setState({errorMsg:"* Please select valid date of service"})
                                    return
                                }
                                else if (this.state.address===''){
                                    this.setState({errorMsg:"* Please set your address"})
                                }
                                else if (this.state.contactNo===''){
                                    this.setState({errorMsg:"* Please set your contact number"})
                                }
                                else 
                                {
                                    this.setState({isVisible:true});
                                    this.addServiceInfo();
                                    this.getServiceInfo();
                                }
                            }} >

                            <Text 
                                style={style.touchButtonLabel}>
                                    Add service
                            </Text>

                        </TouchableOpacity>

                    </View>
                    
                    <View>
                        <Text
                            style={style.labelComponent} >
                                Total Services Reserved ({this.state.totalReserveService})
                        </Text>

                        <FlatList
                            data={this.state.serviceInfo?this.state.serviceInfo:null}
                            renderItem={item => this.renderItemComponent(item)}
                            keyExtractor={item => item.id.toString()} />

                    </View>

                    <View>
                        <Text style={{
                            marginTop:10,
                            marginLeft:10, 
                            marginBottom:5, 
                            fontSize:17
                            }}>Total price: Php {this.state.totalServicePrice.toFixed(2)?this.state.totalServicePrice.toFixed(2):0}</Text>

                        <Text 
                            style={style.labelComponent}>
                                Payment method
                        </Text>

                        <RNPickerSelect
                            onValueChange={(value) => {
                                console.log(value);
                                this.setState({paymentMethodValue:value});
                            }}
                            items={[
                                { label: 'Cash', value: 'Cash' }
                            ]} >

                            <Text 
                                style={style.labelComponentItem} >
                                    {this.state.paymentMethodValue?this.state.paymentMethodValue:'Select an item...'}
                            </Text>
                            
                        </RNPickerSelect>

                        <TouchableOpacity 
                            style={style.touchButton}
                            onPress={()=>{
                                if (this.state.categoryCurrentVal===null){
                                    this.setState({errorMsg:"* Please select category"})
                                    return
                                }
                                else if (this.state.serviceCurrentVal===null){
                                    this.setState({errorMsg:"* Please select service"})
                                    return
                                }
                                else if (this.state.serviceDateCurrentVal===''){
                                    this.setState({errorMsg:"* Please select date of service"})
                                    return
                                }
                                else if (this.state.actualDate.getTime() <= new Date().getTime()){
                                    this.setState({errorMsg:"* Please select valid date of service"})
                                    return
                                }
                                else if (this.state.address===''){
                                    this.setState({errorMsg:"* Please set your address"})
                                }
                                else if (this.state.contactNo===''){
                                    this.setState({errorMsg:"* Please set your contact number"})
                                }
                                else if (this.state.paymentMethodValue===''){
                                    this.setState({errorMsg:"* Please select payment method"})
                                    return
                                }
                                else {
                                    this.setState({isDialogVisible:true})
                                }
                            }} >

                            <Text 
                                style={style.touchButtonLabel} >
                                Book it now
                            </Text>

                        </TouchableOpacity>

                        <Dialog.Container visible={this.state.isDialogVisible}>
                            <Dialog.Title>Book it now!</Dialog.Title>
                            <Dialog.Description>
                                Do you want to proceed?
                            </Dialog.Description>
                            <Dialog.Button label="Cancel" onPress={()=>this.handleCancel()} />
                            <Dialog.Button label="Ok" onPress={()=>this.handleProceed()} />
                        </Dialog.Container>
                        
                    </View>

                </ScrollView>
                
            </SafeAreaView>
        )
    }

}


const style = StyleSheet.create({

    viewErrorMessage: {
        // flex:2, 
        backgroundColor:'white',
        justifyContent: 'center'
    }, 

    viewComponent: {
        justifyContent:'center'
    },

    labelComponent: {
        marginTop:10,
        marginLeft:10, 
        marginBottom:5, 
        fontSize:17
    },

    labelComponentItem: {
        marginLeft:10,
        marginRight:10, 
        marginBottom:5,
        borderWidth:1, 
        padding:8, 
        borderRadius:10, 
        textAlign:'left',
        color:'#424242',
        borderColor:'#039BE5',
    },

    labelErrorMessage: {
        ...Label.self_alignment,
        ...Label.text_alignment,
        ...Label.weight,
        ...Label.red,
        marginTop: 10
    },

    toggleLabel: {
        marginLeft:10, 
        marginBottom:5, 
        marginTop: 10,
        fontSize:17 
    },

    touchButton: {
        ...Button.border,
        ...Button.color,
        ...Button.padding,
        ...Button.alignment,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 15
    },

    touchButtonLabel:{
        ...Button.label
    },

});
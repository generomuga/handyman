import React, { Component } from 'react';

import { CheckBox } from 'react-native-elements';

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

        // console.log(this.navigation)
        // this.props.navigation.jump_to
        // console.log(this.props.navigation.jumpTo('Notification', {
        //     owner:'Gene'
        // }))
        // console.log(this.props.navigation)
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
            status: 'Pending',

            createdDate: '',

            totalServicePrice: 0.00,
            totalReserveService: 0,

            date: new Date(),

            isDateTimePickerVisible: false,
            isUseDefaultAddress: false,
            isUseDefaultContact: false,
            isAddressEditable: true,
            isContactEditable: true,

            serviceInfo: [],
            errorMsg: '',

            isDialogVisible: false,

            isServiceAdded: true
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
        var is_service_added = true
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
                        is_service_added = childsnap.val()['is_service_added']
                        status = childsnap.val()['status']

                        console.log('status',status)

                        if (is_visible === true && is_booked === false && is_service_added === true) {
                            totalPrice = totalPrice + service_price
                            totalReserveService = totalReserveService + 1
                        }

                        if (is_visible === true && is_booked === false) {
                            // totalPrice = totalPrice + service_price
                            // totalReserveService = totalReserveService + 1

                            items.push({
                                id, 
                                category,
                                service,
                                service_date,
                                service_price,
                                service_currency,
                                address,
                                contact_no,
                                is_visible,
                                is_service_added
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
        var status = 'Pending'
        var is_visible = false
        var is_service_added = false

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
                        status = childsnap.val()['status']
                        address = childsnap.val()['address']
                        contact_no = childsnap.val()['contact_no']
                        is_visible = childsnap.val()['is_visible']
                        is_service_added = childsnap.val()['is_service_added']
                      
                        if (is_visible === true && is_service_added === true) {
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
                                address,
                                contact_no,
                                status
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
                is_service_added:this.state.isServiceAdded,
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
                // borderColor:'#F44336',
                borderColor: data.item.is_service_added?'green':'red',
                marginLeft: 20, 
                marginRight: 20,
                marginBottom:10,
                justifyContent:'center',
                // padding: 5
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
        
            {/* <View
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
            </View> */}
            
            <View style={{
                flexDirection:'row',
                padding: 5
                }}>
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
                style={{flexDirection:'row', padding: 5}} >

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
                style={{
                    flexDirection:'row', 
                    padding: 5
                }} >
                
                <MaterialIcons 
                    style={{marginLeft:10}}
                    name="add-location" 
                    size={24} 
                    color="#B71C1C" />
                
                <Text
                    style={{
                        marginLeft:10,
                        // marginRight:10,
                        // padding:5,
                        fontWeight:'400',
                        fontSize:12,
                        alignSelf: 'center',
                    }} >
                        {data.item.address}
                </Text>

            </View>

            
            <View
                style={{
                    flexDirection: 'row',padding: 5
                    // marginBottom: 10
                }} >

                <MaterialIcons 
                    style={{marginLeft:10}}
                    name="money" 
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
            
            <View
                style={{
                    alignItems: 'flex-end'
                }}>

                <CheckBox
                    title='Add to reservation list'
                    checked={data.item.is_service_added}
                    containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                    onPress={()=>{
                        if (data.item.is_service_added === true) {
                            const user = firebase.auth().currentUser;
                            const uid = user['uid']
                    
                            var updates = {}
                            updates['bookings/'+uid+'/'+data.item.id+'/is_service_added'] = false
                            dbRef.update(updates)
                            this.getServiceInfo()
                        }
                        else {
                            const user = firebase.auth().currentUser;
                            const uid = user['uid']
                            var updates = {}
                            updates['bookings/'+uid+'/'+data.item.id+'/is_service_added'] = true
                            dbRef.update(updates)
                            this.getServiceInfo()
                        }
                    }} />

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
        this.clearFields()

        
        // const notif = new NotificationTab;
        // notif.getServiceInfo()

        // this.setState({isBooked:true})

    };


    clearFields() {
        this.setState({categoryCurrentVal:''})
        this.setState({serviceCurrentVal:''})
        this.setState({serviceDateCurrentVal:''})
        this.setState({address:''})
        this.setState({contactNo:''})
        this.setState({errorMsg:''})
    }

    render(){
        return (
            <SafeAreaView
                style={{
                    backgroundColor:'white', 
                    flex:1
                }} >

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
                        
                        <View
                            style={{
                                flexDirection: 'row'
                            }} >

                            <MaterialIcons 
                                style={{marginLeft:10}}
                                name="category" 
                                size={24} 
                                color="#E65100" />

                            <Text 
                                style={style.labelComponent} >
                                Category
                            </Text>

                        </View>

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

                        <View
                            style={{flexDirection:'row'}}>

                            <MaterialIcons 
                                style={{marginLeft:10}}
                                name="cleaning-services" 
                                size={24} 
                                color="#9E9D24" />

                            <Text 
                                style={style.labelComponent} >
                                Service
                            </Text>

                        </View>

                    
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
                            
                        <View
                            style={{flexDirection:'row'}}>

                            <MaterialIcons 
                                style={{marginLeft:10}}
                                name="date-range" 
                                size={24} 
                                color="#0D47A1" />

                            <Text 
                                style={style.labelComponent} >
                                Date of service
                            </Text>

                        </View>

                        <Text 
                            style={style.labelComponentItem}
                            onPress={this.showDateTimePicker} >  
                            {this.state.serviceDateCurrentVal?this.state.serviceDateCurrentVal:"Please select a date"}
                        </Text>
                        
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            display="default" />

                    </View>

                    <View
                        style={style.viewComponent} >

                        <View
                            style={{flexDirection:'row'}}>

                            <MaterialIcons 
                                style={{marginLeft:10}}
                                name="add-location" 
                                size={24} 
                                color="#B71C1C" />

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

                        </View>

                        <TextInput
                            style={style.labelComponentItem}
                            multiline={false}
                            value={this.state.address}
                            placeholder={'Lot/Block No, Street, City, Province'}
                            editable={this.state.isAddressEditable}
                            onChangeText={(address)=>this.setState({address:address})} />

                    </View>

                    <View>

                        <View 
                            style={{flexDirection: 'row'}}>

                            <MaterialIcons 
                                style={{marginLeft:10}}
                                name="contact-phone" 
                                size={24} 
                                color="#2E7D32" />

                            <ToggleSwitch
                                isOn={this.state.isUseDefaultContact}
                                onColor="green"
                                label='Use default mobile number'
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

                        </View>

                        <TextInput
                            style={style.labelComponentItem}
                            value={this.state.contactNo}
                            placeholder={'0917XXXXXXX'}
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
                                else if (!/^\d{11}$/.test(this.state.contactNo)) {
                                    this.setState({errorMsg:"* Please set valid contact number"})
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
                                Total Reserved Services ({this.state.totalReserveService})
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
                                // if (this.state.categoryCurrentVal===null){
                                //     this.setState({errorMsg:"* Please select category"})
                                //     return
                                // }
                                // else if (this.state.serviceCurrentVal===null){
                                //     this.setState({errorMsg:"* Please select service"})
                                //     return
                                // }
                                // else if (this.state.serviceDateCurrentVal===''){
                                //     this.setState({errorMsg:"* Please select date of service"})
                                //     return
                                // }
                                // else if (this.state.actualDate.getTime() <= new Date().getTime()){
                                //     this.setState({errorMsg:"* Please select valid date of service"})
                                //     return
                                // }
                                // else if (this.state.address===''){
                                //     this.setState({errorMsg:"* Please set your address"})
                                // }
                                // else if (this.state.contactNo===''){
                                //     this.setState({errorMsg:"* Please set your contact number"})
                                // }
                                // else if (this.state.paymentMethodValue===''){
                                //     this.setState({errorMsg:"* Please select payment method"})
                                //     return
                                // }
                               
                                if (this.state.serviceInfo.length === 0) {
                                    this.setState({errorMsg:"* Please add service/s"})
                                    return
                                }
                                else if (this.state.totalReserveService < 1) {
                                    this.setState({errorMsg:"* Please add to list"})
                                    return
                                }
                                else if (this.state.paymentMethodValue === '') {
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
        justifyContent:'center',
        marginBottom: 8
    },

    labelComponent: {
        marginTop: 2,
        marginLeft: 5, 
        marginBottom: 8, 
        fontSize: 17,
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
        marginLeft:5, 
        marginBottom:8, 
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
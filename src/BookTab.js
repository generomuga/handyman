import React, { useEffect, useState } from 'react';

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
    // Background, 
    Button,
    Input,
    // InputText,
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

export default function BookTab() {
    
    const [
        errorMessage,
        setErrorMessage,
    ] = useState('');

    const [
        categoryCurrentValue,
        setCategoryCurrentValue,
    ] = useState('');

    const [
        serviceCurrentValue,
        setServiceCurrentValue,
    ] = useState('');

    const [
        categories,
        setCategories,
    ] = useState([]);

    const [
        services,
        setServices,
    ] = useState([]);

    const [
        serviceCurrency,
        setServiceCurrency,
    ] = useState('');

    const [
        servicePrice,
        setServicePrice,
    ] = useState(0);

    const [
        actualDate,
        setActualDate,
    ] = useState('');

    const [
        serviceDateCurrentValue,
        setServiceDateCurrentValue,
    ] = useState('');

    const [
        isDateTimePickerVisible,
        setIsDateTimePickerVisible,
    ] = useState();

    const [
        isUseDefaultAddress,
        setIsUseDefaultAddress,
    ] = useState(false);

    const [
        isAddressEditable,
        setIsAddressEditable,
    ] = useState(true);

    const [
        address,
        setAddress,
    ] = useState('');

    const [
        isUseDefaultContactNo,
        setIsUseDefaultContactNo,
    ] = useState(false);

    const [
        isContactNoEditable,
        setIsContactNoEditable,
    ] = useState(true);

    const [
        contactNo,
        setContactNo,
    ] = useState('');

    const [
        isVisible,
        setIsVisible,
    ] = useState(true);

    const [
        isBooked,
        setIsBooked,
    ] = useState(false); 
    
    const [
        isServiceAdded,
        setIsServiceAdded,
    ] = useState(true);

    const [
        status,
        setStatus,
    ] = useState('Pending');

    const [
        serviceInfo,
        setServiceInfo,
    ] = useState([]);

    const [
        totalServicePrice,
        setTotalServicePrice,
    ] = useState([]);

    const [
        totalReserveService,
        setTotalReserveService,
    ] = useState(0);

    const [
        paymentMethodValue,
        setPaymentMethodValue,
    ] = useState('');

    const [
        isDialogVisible,
        setIsDialogVisible,
    ] = useState(false);

    useEffect(()=>{
        getCategoryList();
        getServiceInfo();
        getDefaultAddress();
        getDefaultContactNo();
    }, [])

    const getCategoryList = () => {
        const items = []

        dbRef.child('tenant/categories').once("value")
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap) {
                        var data = childsnap.val()
                        console.log(data)
                        items.push({
                            label:data,
                            value:data,
                            key:data
                        })
                    });
                    setCategories(items)
                }
            });
    }

    const getServiceList = (category) => {
        console.log('Eyy',category)
        let items = [];
        let price = 0;
        let currency = 'Php';
        let isAvailable = false;
        let name = '';

        dbRef.child('tenant/services/'+category+'/').once("value")
            .then(snapshot => {
                if (snapshot.exists()) {
                        snapshot.forEach(function(childsnap) {
                            name = childsnap.val()['name']
                            price = childsnap.val()['price']
                            currency = childsnap.val()['currency']
                            isAvailable = childsnap.val()['isAvailable']
                        
                            if (isAvailable === true) {
                                items.push({
                                    label:name,
                                    value:name,
                                    key:name
                                })
                            }
                        });
                    
                    setServices(items)
                    setServiceCurrency(currency)
                    setServicePrice(price)
                }
            })
            .catch((error)=>{
                // console.log(error)
            });
    }

    const getServiceInfo = () =>{
        let user = firebase.auth().currentUser;

        let items = []
        let id = ''
        let category = ''
        let service = ''
        let service_date = ''
        let service_price = 0
        let service_currency = ''
        let address = ''
        let totalPrice = 0
        let totalReserveService = 0
        let contact_no = ''
        let is_visible = false
        let is_booked = false
        let is_service_added = true
        let status = ''
        
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

                        if (is_visible === true && is_booked === false && is_service_added === true) {
                            totalPrice = totalPrice + service_price
                            totalReserveService = totalReserveService + 1
                        }

                        if (is_visible === true && is_booked === false) {
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
                
                    setServiceInfo(items)
                    setTotalServicePrice(totalPrice)
                    setTotalReserveService(totalReserveService)
                }
                else {
                    setServiceInfo([])
                    setTotalServicePrice(0)
                    setTotalReserveService(0)
                }
            });
    }

    const getDefaultAddress = () => {
        let user = firebase.auth().currentUser
        let address = ''

        dbRef.child('users').child(user['uid']).get()
            .then((snapshot) => {
                if (snapshot.exists()) {
                    address = snapshot.val()['address']
                    setAddress(address)
                }
            })
    }

    const getDefaultContactNo = () => {
        let user = firebase.auth().currentUser
        let contactNo = ''

        dbRef.child('users').child(user['uid']).get()
            .then((snapshot) => {
                if (snapshot.exists()) {
                    contactNo = snapshot.val()['contactNo']
                    setContactNo(contactNo)
                } 
            })
    }

    const updateBookingDetails = () => {
        let user = firebase.auth().currentUser

        let id = ''
        let category = ''
        let service = ''
        let service_date = ''
        let service_price = 0
        let service_currency = ''
        let contact_no = ''
        let status = 'Pending'
        let address = ''
        let is_visible = false
        let is_service_added = false

        let trasaction_id = new Date().getTime().toString()
        let transactionRef = dbRef.child('transactions/'+user['uid']).child(trasaction_id)
                    
        let items = []
        let items_category = []
        let created_at = new Date().toString()

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
                            let updates = {}
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
                        total_price: totalServicePrice,
                        created_at: created_at,
                        service_currency: serviceCurrency,
                        booking_info:items_category
                    })
                }

                getServiceInfo()
            });   
    }

    const addServiceInfo = () => {
        let user = firebase.auth().currentUser;
        let id = new Date().getTime().toString();
           
        let dte = new Date().toString();

        dbRef.child('bookings/' + user['uid'] +'/'+ id)
            .set({
                id:id,
                category:categoryCurrentValue,
                service:serviceCurrentValue,
                service_date:serviceDateCurrentValue,
                service_price:servicePrice,
                service_currency:serviceCurrency,
                address:address,
                contact_no:contactNo,
                is_visible:isVisible,
                is_booked:isBooked,
                is_service_added:isServiceAdded,
                status:status,
                createdDate:dte
            });
    }

    const showDateTimePicker = () => {
        setIsDateTimePickerVisible(true)
      };
     
    const hideDateTimePicker = () => {
        setIsDateTimePickerVisible(false)
    };
    
    const handleDatePicked = date => {
        let parsed_date = String(date).split(' ');
        let day = parsed_date[0];
        let month = parsed_date[1];
        let dayn = parsed_date[2];
        let year = parsed_date[3];
        let displayDate = month+' '+dayn+' '+year+', '+day

        setActualDate(date)
        setServiceDateCurrentValue(displayDate)
        hideDateTimePicker();
    };
    
    const renderItemComponent = (data) =>
        <View style={{
                backgroundColor:'white', 
                borderRadius:10, 
                borderWidth:2, 
                borderColor: data.item.is_service_added?'green':'red',
                marginLeft: 20, 
                marginRight: 20,
                marginBottom:10,
                justifyContent:'center',
            }} >

            <AntDesign 
                style={{textAlign:'right', position:'relative', marginTop:5, marginRight:5}}
                name="closecircle" 
                size={24} 
                color="#F44336" 
                onPress={()=>{
                    let user = firebase.auth().currentUser;

                    dbRef.child('bookings/'+user['uid']+'/'+data.item.id).remove()                     
                        .then(()=>{
                            let filteredData = serviceInfo.filter(item => item.id !== id);
                            setServiceInfo(filteredData)
                            
                        })
                    getServiceInfo();
                }}
                />

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
                        fontWeight:'400',
                        fontSize:12,
                        alignSelf: 'center',
                    }} >
                        {data.item.address}
                </Text>

            </View>

            
            <View
                style={{
                    flexDirection: 'row',
                    padding: 5
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
                        let updates={}
                        let user = firebase.auth().currentUser;
                        let uid = user['uid']
                        if (data.item.is_service_added === true) {
                            updates['bookings/'+uid+'/'+data.item.id+'/is_service_added'] = false
                            dbRef.update(updates)
                        }
                        else {
                            updates['bookings/'+uid+'/'+data.item.id+'/is_service_added'] = true
                            dbRef.update(updates)
                        }
                        getServiceInfo()
                    }} />

            </View>

        </View>

    const handleCancel = () => {
        setIsDialogVisible(false)
    };

    const handleProceed = () => {
        setIsDialogVisible(false)
        updateBookingDetails()
        clearState()
    };


    const clearState = () => {
        setCategoryCurrentValue('')
        setServiceCurrentValue('')
        setServiceDateCurrentValue('')
        setPaymentMethodValue('')
        setAddress('')
        setContactNo('')
        setErrorMessage('')
    }

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
                        {errorMessage}
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
                            style={style.label} >
                            Category
                        </Text>

                    </View>

                    <RNPickerSelect
                        onValueChange={(value) => {
                            setCategoryCurrentValue(value)
                            setServiceCurrentValue('')
                            setServices([])
                            getServiceList(value)
                        }}
                        items={categories} >
                        
                        <Text 
                            style={style.input} >    
                            {categoryCurrentValue?categoryCurrentValue:'Select an item...'}
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
                            style={style.label} >
                            Service
                        </Text>

                    </View>

                
                    <RNPickerSelect
                        onValueChange={(value) => {
                            setServiceCurrentValue(value)
                        }}
                        items={services} >

                        <Text 
                            style={style.input} >
                            {serviceCurrentValue?serviceCurrentValue:'Select an item...'}
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
                            style={style.label} >
                            Date of service
                        </Text>

                    </View>

                    <Text 
                        style={style.input}
                        onPress={showDateTimePicker} >  
                        {serviceDateCurrentValue?serviceDateCurrentValue:"Please pick a date"}
                    </Text>
                    
                    <DateTimePicker
                        isVisible={isDateTimePickerVisible}
                        onConfirm={handleDatePicked}
                        onCancel={hideDateTimePicker}
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
                            isOn={isUseDefaultAddress}
                            onColor="green"
                            label='Use default address'
                            labelStyle={style.toggleLabel}
                            offColor="red"
                            size="small"
                            onToggle={()=>{
                                getDefaultAddress();
                                setAddress(address)
                                
                                if (isUseDefaultAddress === true){
                                    setIsUseDefaultAddress(false)
                                    setIsAddressEditable(true)
                                }
                                else {
                                    setIsUseDefaultAddress(true)
                                    setIsAddressEditable(false)
                                }
                            }}
                        />

                    </View>

                    <TextInput
                        style={style.input}
                        multiline={false}
                        value={address}
                        placeholder={'Lot/Block No, Street, City, Province'}
                        editable={isAddressEditable}
                        onChangeText={(address)=>setAddress(address)} />

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
                            isOn={isUseDefaultContactNo}
                            onColor="green"
                            label='Use default mobile number'
                            labelStyle={style.toggleLabel}
                            offColor="red"
                            size="small"
                            onToggle={()=>{
                                getDefaultContactNo();
                                setContactNo(contactNo)
                            
                                if (isUseDefaultContactNo === true){
                                    setIsUseDefaultContactNo(false)
                                    setIsContactNoEditable(true)
                                }
                                else {
                                    setIsUseDefaultContactNo(true)
                                    setIsContactNoEditable(false)
                                }
                            }} />

                    </View>

                    <TextInput
                        style={style.input}
                        value={contactNo}
                        placeholder={'0917XXXXXXX'}
                        editable={isContactNoEditable}
                        onChangeText={(contactNo)=>setContactNo(contactNo)}
                    />

                </View>

                <View 
                    style={style.viewComponent} >

                    <TouchableOpacity 
                        style={style.button}
                        onPress={()=>{
                            setErrorMessage('')

                            if (categoryCurrentValue===null){
                                setErrorMessage('Please select category')
                                return
                            }
                            else if (serviceCurrentValue===null){
                                setErrorMessage('Please select service')
                                return
                            }
                            else if (serviceDateCurrentValue===''){
                                setErrorMessage('Please select date of service')
                                return
                            }
                            else if (actualDate.getTime() <= new Date().getTime()){
                                setErrorMessage('Please select valid date of service')
                                return
                            }
                            else if (address===''){
                                setErrorMessage('Please set your address')
                            }
                            else if (contactNo===''){
                                setErrorMessage('Please set your contact number')
                            }
                            else if (!/^\d{11}$/.test(contactNo)) {
                                setErrorMessage('Please set valid contact number')
                            }
                            else 
                            {
                                setIsVisible(true)
                                addServiceInfo();
                                getServiceInfo();
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
                        style={style.label} >
                            Total Reserved Services ({totalReserveService})
                    </Text>

                    <FlatList
                        data={serviceInfo?serviceInfo:null}
                        renderItem={item => renderItemComponent(item)}
                        keyExtractor={item => item.id.toString()} />

                </View>

                <View>
                    <Text style={{
                        marginTop:10,
                        marginLeft:10, 
                        marginBottom:5, 
                        fontSize:17
                        }}>Total price: Php {totalServicePrice?totalServicePrice:0}</Text>

                    <Text 
                        style={style.label}>
                            Payment method
                    </Text>

                    <RNPickerSelect
                        onValueChange={(value) => {
                            setPaymentMethodValue(value)
                        }}
                        items={[
                            { label: 'Cash', value: 'Cash' }
                        ]} >

                        <Text 
                            style={style.input} >
                                {paymentMethodValue?paymentMethodValue:'Select an item...'}
                        </Text>
                        
                    </RNPickerSelect>

                    <TouchableOpacity 
                        style={style.button}
                        onPress={()=>{
                            if (serviceInfo.length === 0) {
                                setErrorMessage('Please add service/s')
                                return
                            }
                            else if (totalReserveService < 1) {
                                setErrorMessage('Please add service to list')
                                return
                            }
                            else if (paymentMethodValue === '') {
                                setErrorMessage('Please select payment method')
                                return
                            }
                            else {
                                setIsDialogVisible(true)
                            }
                        }} >

                        <Text 
                            style={style.touchButtonLabel} >
                            Book it now
                        </Text>

                    </TouchableOpacity>

                    <Dialog.Container visible={isDialogVisible}>
                        <Dialog.Title>Book it now!</Dialog.Title>
                        <Dialog.Description>
                            Do you want to proceed?
                        </Dialog.Description>
                        <Dialog.Button label="Cancel" onPress={()=>handleCancel()} />
                        <Dialog.Button label="Ok" onPress={()=>handleProceed()} />
                    </Dialog.Container>
                    
                </View>

            </ScrollView>
            
        </SafeAreaView>
    )
    
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
    
    button: {
        ...Button.standard,
        marginLeft: 10,
        marginRight: 10
    },

    input: {
        ...Input.standard,
        marginLeft: 10,
        marginRight: 10
    },

    label: {
        ...Label.standard,
        marginTop: 2,
        marginLeft: 5, 
        marginBottom: 8
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
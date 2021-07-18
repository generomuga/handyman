import React, { Component } from 'react';
import { View, Text, Button, FlatList, ScrollView } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import * as firebase from 'firebase';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
import { alignment } from './styles/button';
import { padding } from './styles/inputtext';
import { SafeAreaView } from 'react-navigation';
const dbRef = firebase.database().ref();

export default class NotificationTab extends Component {
        
    componentDidMount() {
        this.getServiceInfo()
    }
    
    // componentDidUpdate() {
    //     this.getServiceInfo()
    // }

    constructor(props){
        super(props)

        this.state = {
            serviceInfo: [],
            isInverted: true,
        }

    }

    getServiceInfo(){

        console.log('Awit')
        console.log(this.state.serviceInfo.length)

        const user = firebase.auth().currentUser;

        var items = []
        var id = ''
        var category = ''
        var service = ''
        var status = ''
        var service_date = ''
        var service_price = 0
        var service_currency = ''
        var totalPrice = 0
        var totalReserveService = 0
        var contact_no = ''
        var is_visible = false
        var is_booked = false
        var is_service_added = false
        var createdDate = ''
        
        dbRef.child('bookings/'+user['uid']).orderByKey().get()           
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
                        createdDate = childsnap.val()['createdDate']

                        if (is_visible === false && is_booked === true) {
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
                                is_visible,
                                status,
                                createdDate
                            })
                        }
                    });
                
                    console.log(items)
                    this.setState({serviceInfo:items})
                    // console.log(serviceInfo)
                    // this.setState({totalServicePrice:totalPrice})
                    // this.setState({totalReserveService:totalReserveService})
                }
                else {
                    // this.setState({serviceInfo:null})
                    // this.setState({totalServicePrice:0})
                    // this.setState({totalReserveService:0})
                }
            });
    }

    renderItemComponent = (data) => {
        // this.getBookingDetails()

        return (
        <View 
            style={{
                borderWidth:1,
                borderColor: '#006064',
                backgroundColor: 'white',
                borderRadius: 10,
                margin: 2,
                padding: 5
            }} >

            <View
                style={{
                    flexDirection: 'row'
                }}>

                <MaterialIcons
                    style={{marginLeft:10}} 
                    name="approval" 
                    size={24} 
                    color="black" />

                <Text 
                    style={{
                        color: data.item.status==='Accepted'?'green':'red',
                        fontWeight: 'bold',
                        marginTop: 2, 
                        marginLeft: 10
                    }}>
                    {data.item.status}
                </Text>

            </View>

            <View
                style={{flexDirection:'row'}}>
                
                <MaterialIcons 
                        style={{marginLeft:10}}
                        name="confirmation-number" 
                        size={24} color="#00695C" />

                <Text
                    style={{
                        marginTop: 2,
                        marginLeft: 10
                    }} >
                    {data.item.id}
                </Text>

            </View>

            <View
                style={{flexDirection:'row'}} >

                <View 
                    style={{flexDirection:'row'}}>

                    <MaterialIcons 
                        style={{marginLeft:10}}
                        name="category" 
                        size={24} 
                        color="#E65100" />

                    <Text
                        style={{
                            marginTop: 2,
                            marginLeft: 10
                        }} >
                        {data.item.category}
                    </Text>

                </View>

                <View
                    style={{flexDirection:'row'}}>

                    <MaterialIcons 
                        style={{marginLeft:10}}
                        name="cleaning-services" 
                        size={24} 
                        color="#9E9D24" />

                    <Text 
                        style={{
                            marginTop: 2,
                            marginLeft: 10
                        }} >
                        {data.item.service}
                    </Text>

                </View>

            </View>

            <View
                style={{
                    flexDirection:'row'
                }}>
                
                <View
                    style={{
                        flexDirection:'row'
                    }}>

                    <MaterialIcons 
                        style={{marginLeft:10}}
                        name="date-range" 
                        size={24} 
                        color="#0D47A1" />
                        
                    <Text
                        style={{
                            marginTop: 2,
                            marginLeft: 10
                        }} >
                        {data.item.service_date}
                    </Text>

                </View>
                
                <View
                    style={{flexDirection:'row'}}>

                    <MaterialIcons 
                            style={{marginLeft:10}}
                            name="attach-money" 
                            size={24} 
                            color="#424242" />

                    <Text
                        style={{
                            marginTop: 2,
                            marginLeft: 10
                        }} >
                            {data.item.service_currency} { data.item.service_price}
                    </Text>

                </View>

            </View>

            <Text
                style={{
                    marginTop: 2,
                    marginRight: 10,
                    color: '#BDBDBD',
                    fontSize: 11,
                    textAlign: 'right'
                }} >
                {data.item.createdDate}
            </Text>
        </View>)
    }

    render(){
        return (

            <SafeAreaView
                style={{
                    backgroundColor: 'white',
                }} >

                <View>

                    <View
                        style={{
                            flexDirection:'row',
                            marginTop: 5
                        }}>
                        <MaterialIcons 
                            style={{marginLeft:10}}
                            name="miscellaneous-services" 
                            size={24} color="black" />

                        <Text
                            style={{
                                marginTop: 2,
                                marginLeft: 5, 
                                marginBottom: 8, 
                                fontSize: 17,
                            }} >
                            Transactions
                        </Text>

                        <MaterialIcons 
                            style={{marginLeft:10}}
                            name="miscellaneous-services" 
                            size={24} color="black" 
                            onPress={()=>{
                                this.getServiceInfo()
                            }}
                            />
                    </View>

                <Text
                    style={{
                        // marginTop: 2,
                        // marginRight: 10,
                        color: '#BDBDBD',
                        fontSize: 11,
                        textAlign: 'center',
                        marginBottom: 8
                    }}>
                        Scroll down/up to refresh
                </Text>

                </View>

                <FlatList
                    data={this.state.serviceInfo}
                    renderItem={item => this.renderItemComponent(item)}
                    keyExtractor={item => item.id.toString()}
                    inverted={this.state.isInverted}
                    horizontal={false} 
                    // onScroll={()=>{this.getServiceInfo()}}
                    onScrollBeginDrag={()=>this.getServiceInfo()}
                    onScrollEndDrag={()=>this.getServiceInfo()}
                    />
                        
            </SafeAreaView>
        )
    }

}
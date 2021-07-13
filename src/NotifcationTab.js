import React, { Component } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

import * as firebase from 'firebase';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
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
            serviceInfo: []
        }

    }

    getServiceInfo(){

        console.log('Awit')
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

                        console.log('nasds',is_visible, is_booked)

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
                                status
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
        <View style={{borderWidth:1}}>
            <Text>
                {data.item.id}
            </Text>

            <Text>
                {data.item.category}
            </Text>

            <Text>
                {data.item.service}
            </Text>
            <Text>
                {data.item.service_date}
            </Text>
            <Text>
                {data.item.status}
            </Text>
        </View>)
    }



    render(){
        return (
            <View>
                <Text>Transactions</Text>

                <FlatList
                    data={this.state.serviceInfo}
                    renderItem={item => this.renderItemComponent(item)}
                    keyExtractor={item => item.id.toString()}
                    inverted={true}
                    horizontal={false} 
                    // onScroll={()=>{this.getServiceInfo()}}
                    onScrollBeginDrag={()=>this.getServiceInfo()}
                    onScrollEndDrag={()=>this.getServiceInfo()}
                    />
                    
                    
            </View>

            
        )
    }

}
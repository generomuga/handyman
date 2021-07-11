import React, { Component } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

import * as firebase from 'firebase';
const dbRef = firebase.database().ref();

export default class NotificationTab extends Component {
        
    componentDidMount() {
        this.getTransactionDetails();
    }
    
    constructor(props){
        super(props)

        this.state = {
            notifications: []
        }

    }

    getBookingDetails = async(booking_ids) => {

        console.log(booking_ids)

        // const user = firebase.auth().currentUser;
        // var refBook = dbRef.child('bookings').child(user['uid']);
    }

    getTransactionDetails = async() => {

        console.log('test');

        var items = []

        const user = firebase.auth().currentUser;

        var refBook = dbRef.child('bookings').child(user['uid']);
    
        

        await dbRef.child('transactions').child(user['uid']).get()
            .then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap) {
                        var data = childsnap.val()
                        var transaction_id = childsnap['key']
                        var booking_ids = data['booking_id']
                        var created_at = data['created_at']
                        var service_currency = data['service_currency']
                        var total_price = data['total_price']
                        // console.log(id)
                        
                        const booking_info = []
                        var category = ''
                    
                        booking_ids.forEach(function(child) {
                            // console.log('child',child)
                            
                            refBook.child(child).once("value")
                                .then((snapshot) => {
                                    if (snapshot.exists()) {
                                        category = snapshot.val()['category'];
                                        console.log(category)
                                        booking_info.push(category)
                                        // category = snapshot.val()['category']
                                        // console.log(snapshot.val())
                                    }
                                    
                                });
                                
                        })
                        console.log(booking_info)
                        // console.log(booking_ids)
                        

                        items.push({
                            id:transaction_id,
                            transaction_id:transaction_id,
                            booking_ids:booking_ids,
                            created_at:created_at,
                            service_currency:service_currency,
                            total_price:total_price
                        })

                        // getBookingDetails(booking_ids);

                    });

                    // console.log(items)

                    this.setState({notifications:items})

                    // console.log('Result askin',this.state.notifications)
                }
                else {
                     console.log("No data available")
            
                }
            });
        
        }
    
    renderItemComponent = (data) => 
        <View>
            <Text>
                {data.item.id}
            </Text>
            <Text>
                {data.item.transaction_id}
            </Text>
            <Text
                onLo
            >
                {data.item.booking_ids}
            </Text>
            <Text>
                {data.item.created_at}
            </Text>
            <Text>
                {data.item.service_currency}
            </Text>
            <Text>
                {data.item.total_price}
            </Text>
        </View>

    render(){
        return (
            <View>
                <Text>Transactions</Text>

                <FlatList
                    data={this.state.notifications}
                    renderItem={item => this.renderItemComponent(item)}
                    keyExtractor={item => item.id.toString()}
                    horizontal={true}
                />

            </View>

            
        )
    }

}
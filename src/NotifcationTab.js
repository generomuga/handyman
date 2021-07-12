import React, { Component } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

import * as firebase from 'firebase';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
const dbRef = firebase.database().ref();

export default class NotificationTab extends Component {
        
    componentDidMount() {
        this.getTransactionDetails();
    }
    
    constructor(props){
        super(props)

        this.state = {
            notifications: [],
            bookingDetails: [{
                id: 1,
                category:'Hone'
            }]
        }

    }

    getTransactionDetails = async() => {

        console.log('test');

        var items = []
        var items_trans = []

        const user = firebase.auth().currentUser;

        var refBook = dbRef.child('bookings').child(user['uid']);
    
        await dbRef.child('transactions').child(user['uid']).get()
            .then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap) {
                        var data = childsnap.val()
                        var transaction_id = childsnap['key']
                        var created_at = data['created_at']
                        var service_currency = data['service_currency']
                        var total_price = data['total_price']
                        var book_info = data['booking_info']
                        // console.log('Data',book_info)

                        // this.getBookingDetails(booking_ids)
                        // console.log(id)
                        
                        // const booking_info = []
                        // var category = ''
                    
                        // booking_ids.forEach(function(child) {
                        //     // console.log('child',child)
                            
                        //     refBook.child(child).once("value")
                        //         .then((snapshot) => {
                        //             if (snapshot.exists()) {
                        //                 category = snapshot.val()['category'];
                        //                 // console.log(category)
                        //                 booking_info.push({id:snapshot.key,category:category})
                        //                 // category = snapshot.val()['category']
                        //                 // console.log(snapshot.val())
                        //             }
                        //             console.log(booking_info)
                        //             this.setState({bookingDetails:booking_info})
                        //         });
                                 
                        // })
                         
                        items.push({
                            id:transaction_id,
                            transaction_id:transaction_id,
                            created_at:created_at,
                            service_currency:service_currency,
                            total_price:total_price,
                            book_info:book_info
                        })

                        items_trans.push({
                            id:transaction_id,
                            book_info:book_info
                        })

                        // getBookingDetails(booking_ids);

                    });

                    // console.log('Ey',items)

                    console.log('Ery',items_trans);
                    this.setState({bookingDetails:items_trans})
                    this.setState({notifications:items})
                    // this.setState({bookingDetails:book_info})
                    // console.log('T',bookingDetails)

                    // console.log('Result askin',this.state.notifications)
                }
                else {
                     console.log("No data available")
            
                }
            });
        
        }
    
    renderItemComponent = (data) => {
        // this.getBookingDetails()

        return (
        <View>
            <Text>
                {data.item.id}
            </Text>
            <Text>
                {data.item.transaction_id}
            </Text>
            <Text
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

            <FlatList
                data={this.state.bookingDetails}
                renderItem={(item) => this.renderItemComponent2(item)}
                keyExtractor={item => item.id.toString()}
                horizontal={false} />
        </View>)
    }

    renderItemComponent2 = (data) => {

        var test = ''
        data.item.book_info.forEach(element => {
                    console.log(element['address'])
                    test = test + element['address'] + '\n'
            //         return <View>
        
            //             <Text>Awit</Text>
            //         </View>
            })
        return (
            
            <Text>{test}</Text>
            )

    }


    
    // <View>
    //     <Text>NMgangangna</Text>
    //     <Text>
    //         {data.item.id}
    //     </Text>
        
    //     {/* <Text>
    //         Awit
    //         {data.item.book_info[0]['address']}
    //     </Text> */}


    //     {data.item.book_info.forEach(element => {
    //         console.log(element['address'])
    //         return <View>

    //             <Text>Awit</Text>
    //         </View>
    //     })}
    // </View>
    

    render(){
        return (
            <View>
                <Text>Transactions</Text>

                <FlatList
                    data={this.state.notifications}
                    renderItem={item => this.renderItemComponent(item)}
                    keyExtractor={item => item.id.toString()}
                    horizontal={false} />
               
                            
            </View>

            
        )
    }

}
import React, { useEffect, useState } from 'react';

import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet,
    SafeAreaView
} from 'react-native';

// import { SafeAreaView } from 'react-navigation';

import { MaterialIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';

const dbRef = firebase.database().ref();

export default function NotificationTab({navigation}) {

    const [
        serviceInfo,
        setServiceInfo,
    ] = useState([]);

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getServiceInfo();
          });

        return unsubscribe;
    }, [navigation])

    const getServiceInfo = () => {

        console.log('AWIT')
        let user = firebase.auth().currentUser;
        let items = []
        let transaction_id = ''
        let total_price = 0
        let totalReserveService = 0
        let is_visible = false
        let is_booked = false
        let is_service_added = false
        let createdDate = ''
        let booking_info = []
        

        // TODO: Implement query order
        // const query = firebase.database().ref('transactions/'+user['uid']).orderByChild('total_price').limitToLast(100)
        // query.on('child_added', snapshot => {
        // const transaction_id = snapshot.val().transaction_id
        // const total_price = snapshot.val().total_price
        // const booking_info = snapshot.val().booking_info
        // console.log(booking_info)
        // })
        // query.get().then(snapshot =>{
        //     console.log(snapshot)
        // })
    
        dbRef.child('transactions/'+user['uid']).get()    
            .then(snapshot => {
                if (snapshot.exists()) {
                    snapshot.forEach(function(childsnap){
                        transaction_id = childsnap.key
                        createdDate = childsnap.val()['created_at']
                        service_currency = childsnap.val()['service_currency']
                        total_price = childsnap.val()['total_price']
                        booking_info = childsnap.val()['booking_info']
                        
                        let booking_info_items = []
                        let booking_id = ''
                        let category = ''
                        let service = ''
                        let status = ''
                        let service_date = ''
                        let service_price = 0
                        let service_currency = ''
                        let contact_no = ''
                        let address = ''

                        booking_info.forEach(function(childsnap1){
                            booking_id = childsnap1['id']
                            category = childsnap1['category']
                            service = childsnap1['service']
                            address = childsnap1['address']
                            service_currency = childsnap1['service_currency']
                            service_price = childsnap1['service_price']
                            service_date = childsnap1['service_date']
                            contact_no = childsnap1['contact_no']
                            
                            status = childsnap1['status']

                            booking_info_items.push({
                                booking_id,
                                category,
                                service,
                                address,
                                service_currency,
                                service_price,
                                service_date,
                                contact_no,
                                status
                            })
                        })

                        items.push({
                            transaction_id,
                            createdDate,
                            service_currency,
                            total_price,
                            booking_info_items
                        })

                    });
                    
                    setServiceInfo(items.reverse())
                }
                else {
                    
                }
            });
    }

    const renderItemComponent = (data) => {
        
        return (
            <View 
                style={{
                    borderWidth:1,
                    borderColor: '#006064',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    margin: 5,
                    padding: 5
                }} >

                <View
                    style={{
                        flexDirection:'row',
                        alignSelf: 'flex-end',
                        marginRight: 20
                    }} >

                    <MaterialIcons 
                        style={{marginLeft:10}}
                        name="confirmation-number" 
                        size={24} color="#00695C" />

                    <Text 
                        style={{
                            marginLeft:10,
                            fontWeight:'bold',
                            alignSelf: 'center',
                            fontSize: 17,
                        }}
                    >{data.item.transaction_id}</Text>
                </View>

                <View
                    style={{
                        flexDirection:'row',
                        alignSelf:'flex-end',
                        marginRight: 25,
                    }}>

                    <MaterialIcons 
                            style={{marginLeft:10}}
                            name="money" 
                            size={24} 
                            color="#424242" />

                    <Text
                        style={{
                            marginTop: 2,
                            marginLeft: 10,
                            fontSize: 14,
                            fontWeight: 'bold'
                        }} >
                            {data.item.service_currency} { data.item.total_price}
                    </Text>

                </View>

                <FlatList
                    data={data.item.booking_info_items}
                    renderItem={item => renderChildItemComponent(item)}
                    keyExtractor={item => item.booking_id.toString()}
                    />

                <Text
                    style={{
                        marginTop: 2,
                        marginLeft: 30,
                        color: '#BDBDBD',
                        fontSize: 11,
                        textAlign: 'left'
                    }} >
                    {data.item.createdDate}
                </Text> 
            </View>
        )
    }

    const renderChildItemComponent = (data) => {
       
        return (
            <View
                style={{
                    borderWidth:2,
                    borderRadius:10,
                    borderColor: data.item.status==='Pending'?'red':'green',
                    marginLeft:15,
                    marginRight: 15,
                    marginTop: 5,
                    marginBottom: 5,
                    padding: 5,
                    borderStyle: 'dashed',
                }}>

                <View
                    style={{
                        flexDirection:'row',
                        // alignSelf: 'flex-end'
                        padding: 5
                    }}>

                    <MaterialIcons
                        style={{marginLeft:10}} 
                        name="approval" 
                        size={27} 
                        color="#5D4037" />

                    <Text 
                        style={{
                            color: data.item.status==='Accepted'?'green':'red',
                            fontWeight: 'bold',
                            marginTop: 2, 
                            marginLeft: 5,
                            fontSize: 17,
                            // alignSelf: 'flex-end'
                        }}>
                        {data.item.status}
                    </Text>

                </View>


                <View
                    style={{
                        flexDirection:'column',
                        marginLeft:5,
                        padding: 5
                    }}>

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
                                marginLeft: 5
                            }} >
                            {data.item.category}
                        </Text>

                    </View>

                </View>

                <View
                    style={{
                        flexDirection:'column',
                        marginLeft:5,
                        padding: 5
                    }}>

                    <View
                        style={{
                            flexDirection:'row',
                        }}>

                        <MaterialIcons 
                            style={{marginLeft:10}}
                            name="cleaning-services" 
                            size={24} 
                            color="#9E9D24" />

                        <Text 
                            style={{
                                marginTop: 2,
                                marginLeft: 5
                            }} >
                            {data.item.service}
                        </Text>

                    </View>

                </View>

                <View
                    style={{
                        flexDirection:'row',
                        marginLeft:5,
                        padding: 5
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
                                marginLeft: 5
                            }} >
                            {data.item.service_date}
                        </Text>

                    </View>

                </View>

                <View
                    style={{
                        flexDirection:'row',
                        marginLeft:5,
                        padding: 5
                    }}>
                    <View
                        style={{
                            flexDirection:'row',
                            marginLeft:1
                        }}>

                        <MaterialIcons 
                            style={{marginLeft:10}}
                            name="contact-phone" 
                            size={24} 
                            color="#2E7D32" />
                            
                        <Text
                            style={{
                                marginTop: 2,
                                marginLeft: 5
                            }} >
                            {data.item.contact_no}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection:'row',
                        marginLeft:5,
                        padding: 5
                    }}>

                    <MaterialIcons 
                        style={{marginLeft:10}}
                        name="add-location" 
                        size={24} 
                        color="#B71C1C" />
                        
                    <Text
                        style={{
                            marginTop: 2,
                            marginLeft: 5,
                            // fontSize: 13
                        }} >
                        {data.item.address}
                    </Text>

                </View>

                <View
                    style={{
                        flexDirection:'row',
                        alignSelf: 'flex-end',
                        padding: 5
                    }}>

                    <MaterialIcons 
                            style={{marginLeft:10}}
                            name="money" 
                            size={24} 
                            color="#424242" />

                    <Text
                        style={{
                            marginTop: 2,
                            marginRight: 10,
                            marginLeft: 5
                        }} >
                            {data.item.service_currency} { data.item.service_price}
                    </Text>

                </View>

            </View>
        )
    }

    const renderEmptyList = () => {
        return (
            <View
                style={{
                    padding: 50
                }}>
                <Text
                    style={{
                        color: '#BDBDBD',
                        fontSize: 11,
                        textAlign: 'center',
                        marginBottom: 8
                    }}>
                        Scroll down to refresh
                </Text>
            </View>
        )
    }

    return (

        <SafeAreaView
            style={{
                backgroundColor: 'white',
                flex: 1
            }} >

            <View
                style={{
                    flexDirection:'row',
                    marginTop: 10
                }}>
                <MaterialIcons 
                    style={style.icon}
                    name="miscellaneous-services" 
                    size={24} color="black" />

                <Text
                    style={{
                        marginTop: 2,
                        marginLeft: 5, 
                        marginBottom: 8, 
                        fontSize: 17,
                    }} >
                    History
                </Text>

            </View>

            <View
                style={{
                    marginBottom: 60
                }}
                >

                <FlatList
                    data={serviceInfo}
                    renderItem={item => renderItemComponent(item)}
                    keyExtractor={item => item.transaction_id.toString()}
                    // inverted={this.state.isInverted}
                    inverted={false}
                    horizontal={false} 
                    onRefresh={()=>{getServiceInfo()}}
                    refreshing={false}
                    ListEmptyComponent={renderEmptyList()}
                    />
                    
            </View>
        </SafeAreaView>
    )
  
}

const style = StyleSheet.create({

    icon: {
        marginLeft:10
    }

})
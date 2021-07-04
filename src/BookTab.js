import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as firebase from 'firebase';

export default class BookTab extends Component {
        
    componentDidMount(){
        const listCategory = this.getCategoryList();
        this.setState({categories:listCategory});

        // const listService = this.getServiceList('Repair');
        // this.setState({services:listService});
    }

    constructor(props){
        super(props)

        this.state = {
            categories: [],
            services: []
        }

    }

    getCategoryList() {

        const dbRef = firebase.database().ref();

        var items = []
        dbRef.child('tenant/categories').get()                        
            .then(snapshot => {
                if (snapshot.exists()) {

                    snapshot.forEach(function(childsnap){
                        var key = childsnap.key;
                        var data = childsnap.val();
                        // var ref = db.child(key );
                        items.push(data);
                        // console.log(data);
                        // console.log(items);
                    }
                    )}
                else {
                    items.push('Wala pa po idol');
                    console.log('user not found');
                }
            });

        console.log('Categories'+items);
        return items;

    }


    getServiceList(category) {

        const dbRef = firebase.database().ref();

        var items = []

        dbRef.child('tenant/services/'+category+'/').get()                        
            .then(snapshot => {
                if (snapshot.exists()) {

                    snapshot.forEach(function(childsnap){
                        var key = childsnap.key;
                        var data = childsnap.val();
                        // var ref = db.child(key );
                        
                        items.push(data);
                        console.log('Services'+data);
                        // console.log(items);
                    }
                    )}
                else {
                    // this.setState({services:['Wala eh']});
                    items.push('Wala idol');
                    console.log('services not found');
                }
            });

        // console.log(items);
        return items;

    }

    render(){
        return (
            <View>
                <ModalDropdown 
                    defaultValue={this.state.categories[0]}
                    options={this.state.categories} 
                    onSelect={(value)=>{
                                console.log('Vale',String(this.state.categories[value]));
                                const listService = this.getServiceList(String(this.state.categories[value]));
                                this.setState({services:listService})
                            }
                        }
                    // renderRow={()=>this.setState({services:['tets']})}
                    >
                </ModalDropdown>

                <ModalDropdown 
                    defaultValue={this.state.services[0]}
                    options={this.state.services} 
                    //  ref={(ref)=> this.state.services = ref}
                    onSelect={(value)=>{
                    
                    }}
                    >

                </ModalDropdown>

                <ModalDropdown 
                    defaultValue="Payment method..."
                    options={['Service']} >
                </ModalDropdown>
            </View>
        )
    }

}
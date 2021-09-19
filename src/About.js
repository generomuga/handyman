import React, { useState, useEffect } from 'react';

import { 
  View, 
  Text,  
  Image
} from 'react-native';

import * as firebase from 'firebase';

import Anchor from './Anchor';

const dbRef = firebase.database().ref();

export default function About({navigation}) {

    const [
        companyProfile,
        setCompanyProfile
    ] = useState('');

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getCompanyProfile();
        });

        return unsubscribe;
    }, [navigation]) 

    const getCompanyProfile = () => {
        let companyProfile = ''

        dbRef.child('tenant/company').once("value")
            .then(snapshot => {
                if (snapshot.exists()) {
                    companyProfile = snapshot.val()['profile']
                }
                setCompanyProfile(companyProfile)
            });
    }

    return (
        <View 
            style={{
            color:'#fffeff',
            flex: 1
            }} >

            <View
                style={{
                    alignItems: 'center',
                    backgroundColor: '#E3F2FD'
                }}
                >
                <Image 
                    style={{
                        width: 200,
                        height: 200,
                        marginTop: 10,
                        marginBottom: 10
                    }}
                    source={{uri:'https://firebasestorage.googleapis.com/v0/b/handyman-plus.appspot.com/o/tenant%2Ftlogo.png?alt=media&token=62de0cc2-5bb4-45bc-8c78-42466da97ac8'}}
                /> 
            </View>

            <Text
                style={{
                    textAlign: 'justify',
                    alignContent: 'center',
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 15,
                    marginBottom: 20,
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#424242'
                }}>
                {companyProfile}
            </Text>

            <View
                style={{
                    alignSelf: 'center',
                    marginBottom: 15
                }}>
                <Anchor href="https://jsparling.github.io/hashmarks/terms_and_conditions"> 
                    <Text style={{fontSize:15}}>Terms and Conditions </Text>
                </Anchor> 
            </View>

            <View
                style={{
                    alignSelf: 'center'
                }}>
                <Anchor href="https://jsparling.github.io/hashmarks/terms_and_conditions"> 
                    <Text style={{fontSize:15}}>Privacy Policy</Text>
                </Anchor> 
            </View>

        </View>
    )

}
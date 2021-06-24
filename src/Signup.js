import React, { Component } from 'react';
import { 
    View, 
    TextInput, 
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { 
    Background, 
    InputText, 
    Button
} from './styles';

export default class Signup extends Component {

    constructor(props){
        super(props)
    }
    
    render(){
        return (
            <View style={style.background}>
                
                <TextInput 
                    style={style.textinput} 
                    placeholder='email or mobile' 
                    autoCapitalize='none' />

                <TextInput 
                    style={style.textinput} 
                    placeholder='password'
                    autoCapitalize='none' />

                <TextInput 
                    style={style.textinput} 
                    placeholder='confirm password'
                    autoCapitalize='none' />

                <TouchableOpacity style={style.touchbutton}>
                    <Text style={style.touchbuttonlabel}>Join now</Text>
                </TouchableOpacity>

            </View>            
        )
    }

}


const style = StyleSheet.create({

    background:{
        ...Background.blue,
        ...Background.fullscreen
    },

    textinput:{
        ...InputText.border,
        ...InputText.padding,
        ...InputText.color,
        ...InputText.text_alignment,
        marginLeft: 25,
        marginRight: 25,
        top: 100,
        marginBottom: 10
    },

    touchbutton: {
        ...Button.border,
        ...Button.color,
        ...Button.padding,
        ...Button.alignment,
        marginLeft: 25,
        marginRight: 25,
        padding:15,
        marginTop: 25,
        position:'absolute', 
        top:250,
        alignSelf:'center',
        width:'88%'
    },

    touchbuttonlabel:{
        ...Button.label
    }

})
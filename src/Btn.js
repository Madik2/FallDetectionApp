import { Text, TouchableOpacity } from 'react-native';
import React from 'react'

export default function Btn({bgColor, btnLabel, textColor, Press}) {
    return (
        <TouchableOpacity 
        onPress={Press}
        style={{ 
            backgroundColor: bgColor,
            borderRadius: 100,
            alignSelf: 'center', 
            width: 250,
            paddingVertical: 15,
            paddingHorizontal:40,
             }}>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: "bold", textAlign:'center', fontFamily:"System" }}>
                {btnLabel}
            </Text>
        </TouchableOpacity>
    )
}

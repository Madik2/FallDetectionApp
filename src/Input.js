import { useLinkProps } from "@react-navigation/native";
import React from "react";
import { View,Text,TextInput,StyleSheet,TouchableHighlight,onPress} from "react-native";


const Input = ({
    label,
    iconName,
    error,
    password,
    onFocus = () => {},
    ...props
}) => {
    const [isFocused,setIsFocused] = React.useState(false);
    const [hidePassword,setHidePassword] = React.useState(password);
    return (
    <View >
        <Text style={style.label}>{label}</Text>
        <TouchableHighlight style={{ flex: 1 }} onPress={onPress}>
        <View 
        style={[
            style.InputContainer,
        {
            borderColor: error  
            ? "black"
            : isFocused 
            ? '#74144E'
            :"gray",
        },
        ]}>
        <TextInput
        secureTextEntry = {hidePassword}
        autoCorrect={false}
        onFocus={() =>{
        onFocus();
        setIsFocused(true);
        }}
        onBlur={() => {
            setIsFocused(false);
        }}
        
        style={{color:"black", flex:1}}
        {...props}/>
        </View>
        </TouchableHighlight>
        {error && ( <Text style={{color: "red", fontSize:12, marginTop: 7}}>
        {error}</Text>)}
        
    </View>
);
};
const style = StyleSheet.create({
    label: {
        marginVertical: 4,
        fontSize: 16,
        marginHorizontal:24,
        color: "black",
        fontWeight: "bold"
    },
    InputContainer: {
        height: 48,
        ImageBackgroundColor: "grey",
        flexDirection: 'row',
        marginHorizontal: 16,
        borderWidth: 1.5,
        alignItems: 'center',
        borderRadius: 12,
        padding: 8,
        marginBottom:8
},
});

export default Input;


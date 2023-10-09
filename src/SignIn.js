import React from "react";
import {View, StyleSheet, Text, ImageBackground, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,Alert} from 'react-native';
import Input from './Input';
import { myColor } from './Constants';
import Btn from './Btn';
import Tabs from "./Tabs";
import { getAuth, signInWithEmailAndPassword}  from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './Firebase/firebase-config';
import { setDefaultEventParameters } from 'firebase/analytics';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
const SignIn = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigation = useNavigation();

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            console.log('Signed In!')
            const user = userCredential.user;
            console.log(user)
            const userToken = await user.getIdToken();
            await SecureStore.setItemAsync('userToken', userToken);
            navigation.navigate("Tabs");
        })
        .catch(error => {
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              Alert.alert('Invalid Password', 'The password you entered is incorrect');
            } else if (errorCode === 'auth/user-not-found') {
              Alert.alert('User Not Found', 'There is no user corresponding to the given email address');
            } else if (errorCode === 'auth/missing-password') {
              Alert.alert('Missing Password', 'Password is required');
            }else if (errorCode === 'auth/invalid-email') {
                Alert.alert('Invalid Email', 'The email address you entered is invalid');
            } else{
              Alert.alert('Error', errorMessage);
            }
        })
    }
    return ( 
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
        <ScrollView>
        <View>
            <Text style={{ 
                 color: myColor,
                 fontSize: 32,
                 fontFamily: 'System',
                 fontWeight: "bold",
                 marginTop:89,
                 paddingLeft:16}}> 
                 SIGN IN
                 </Text>
            </View>
            <View>
                <ImageBackground
                    style={{
                        height: 400,
                    }}
                    resizeMode="contain"
                    source={require("./assets/backSignin.png")}
                />
            </View>
            <View style={{marginVertical: 20, marginTop:40}}>
            <Input 
            onChangeText = {(text) => setEmail(text)}
            placeholder= "Please type in your email address"
            label="Email"
            keyboardType="email-address"
            />
            <Input 
            onChangeText = {(text) => setPassword(text)}
            placeholder= "Please type in your password"
            label="Password"
            secureTextEntry
            password
            />
            </View>
            <View>
                <Btn bgColor = '#74144E' textColor='white' btnLabel="Login" Press={handleSignIn}/>  
            </View>
            </ScrollView>
            </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        //width: Dimensions.get('window').width,
        flex: 1,
    },


})

export default SignIn;
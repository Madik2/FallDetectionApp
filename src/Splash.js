import { View, StyleSheet,Image, StatusBar } from 'react-native';
import { myColor } from './Constants';
import React, {useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';
//import { StatusBar } from 'expo-status-bar';

const Splash = ({navigation}) => {
    useEffect(() => {
        checkUserToken();
      }, []);
    
      const checkUserToken = async () => {
        setTimeout(async () => {
        const userToken = await SecureStore.getItemAsync('userToken');
        if (userToken) {
          // User token exists, navigate to the authenticated screen
          navigation.navigate('Tabs');
        } else {
          // User token doesn't exist, navigate to the sign-in screen
          navigation.navigate('FirstPage');
        }
      }, 1500);
      };
    return (
        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',backgroundColor:myColor}}>
            <StatusBar barStyle="light-content" hidden={false}
            backgroundColor="#74144E"/>
            <Image source={require("./assets/splash-screen.png")} style={{width:160,height:160}}/>
        
        </View>
        
    );
};

const styles = StyleSheet.create({});

export default Splash;
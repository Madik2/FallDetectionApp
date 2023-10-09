import React from 'react';
import { View, StyleSheet, Text, ImageBackground, SafeAreaView, Touchable, TouchableOpacity } from 'react-native';
import Background from './Background';
import Btn from './Btn';
import { myColor } from './Constants';
import SignUp from './SignUp';
import SignIn from './SignIn';


const FirstPage = (props) => {
    return (
        <SafeAreaView>
            <View>
                <Text style={{ 
                    color: myColor,
                    fontSize: 32,
                    fontFamily: 'System',
                    fontWeight: "bold",
                    marginTop:44,
                    textAlign:'center'}}> FALL DETECTION APP</Text>
            </View>
            <View>
                <ImageBackground
                    style={{
                        height: 550,
                    }}
                    resizeMode="contain"
                    source={require("./assets/back2.png")}
                />
            </View>
            <View>
                <Btn bgColor = '#74144E' textColor='white' btnLabel="Get Started" Press={() => props.navigation.navigate("SignUp")}/>  
            </View>
            <View
            style={{
                flexDirection: 'row',
                alignItems:'flex-end',
                justifyContent: 'center',
                paddingVertical: 4,
                marginButton: 20
            }}>
                <Text style={{ 
                    color: 'black',
                    fontSize: 16,
                    }}> Already have an account?
                    </Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate("SignIn")}>
                        <Text style={{ color: 'black',fontWeight: 'bold',fontSize: 16 }}>
                            Sign in
                        </Text>
                    </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default FirstPage;
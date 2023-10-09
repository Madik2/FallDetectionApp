import React from 'react';
import {View, ImageBackground, Dimensions} from 'react-native';
const { height } = Dimensions.get("window");
const Background = ({ children }) => {
    return(
        <View> 
            <View >
                {children}
            </View>
            <ImageBackground
             source={require("./assets/back2.png")} 
             resizeMode="contain"
             style={{ 
                height: height / 2.5,
                width:300, 
                alignSelf:'center'
              }}
              />
           
        </View>
    );
}


export default Background;
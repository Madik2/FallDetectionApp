import { View, Text, Image} from 'react-native'
import React, { useState, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import MyProfile from './MyProfile';
import MainPage from './MainPage';
import Info from './Info';
import { getDatabase, ref, onValue, update, get, exists } from "firebase/database";
import { getAuth, onAuthStateChanged, deleteUser, signOut } from "firebase/auth";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = getDatabase();
const auth = getAuth();

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState('');
  const [fullName, setFullName] = useState('');
  const [name,setName] = React.useState('');


  useEffect(() => {
    const retrieveUserProfile = async () => {
      try {
        const userProfileData = await AsyncStorage.getItem('userProfile');
        if (userProfileData) {
          const userProfile = JSON.parse(userProfileData);
          setFullName(userProfile.fullName || '');
          setUid(userProfile.uid || '');
        }
      } catch (error) {
        console.log('Error retrieving user profile data:', error);
      }
    };
  
    const loadUserProfile = async (uid) => {
      const userRef = ref(db, `users/${uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const updatedData = {
            ...data,
            fullName: fullName || data.fullName,
            uid: uid
          };
  
          setFullName(updatedData.fullName);
          setUid(updatedData.uid); 
  
          AsyncStorage.setItem('userProfile', JSON.stringify(updatedData))
            .then(() => {
              setIsLoggedIn(true);
            })
            .catch((error) => {
              console.log('Error saving user profile data:', error);
            });
        }
      });
    };
    const handleAuthStateChanged = (userProfile) => {
        if (userProfile) {
          console.log("userbun", userProfile);
          const uid = userProfile.uid;
          setUid(uid);
          loadUserProfile(uid);
        } else {
          setFullName('');
          setEmail('');
          setPhoneNumber('');
          setEmergencyPhone('');
          setIsLoggedIn(false);
        }
      };
    
      const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
    
      retrieveUserProfile();
    
      return () => {
        unsubscribe();
      };
    }, []);
  
  return (
    <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
            showLabel: false}}
    >
    <Tab.Screen
  name="MyProfile"
  component={MyProfile}
  options={{
    headerTitle: `Hello, ${fullName}`,
    headerStyle: {
      backgroundColor: '#74144E',
      height: 140
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color: '#fff',
      fontSize: 28,
      marginBottom: -52,
      marginLeft: -146,
    },
    tabBarIcon: ({ focused }) => (
      <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
        <Image
          source={require('./assets/user.png')}
          resizeMode='contain'
          style={{
            width: 25,
            height: 25,
            tintColor: focused ? '#74144E' : '#748c94',
          }}
        />
        <Text style={{ color: focused ? '#74144E' : '#748c94', fontSize: 12 }}>MY PROFILE</Text>
      </View>
    ),
  }}
/>
    <Tab.Screen name = "Home" component={MainPage} options={{ headerShown: false,
        tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent: 'center', top:10}}>
                <Image
                source={require('./assets/home.png')}
                ResizeMode='contain'
                style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#74144E' : '#748c94',
                }}/>  
                <Text style={{color:focused ? '#74144E' : '#748c94', fontSize:12}}>HOME</Text>
            
            </View>
        ),
    }}/>
    <Tab.Screen name = "Info" component={Info} options={{
      headerTitle: `INFORMATION`,
      headerStyle: {
        backgroundColor: '#74144E',
        height: 140
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 24,
      },
        tabBarIcon: ({focused}) => (
            <View style={{alignItems:'center', justifyContent: 'center', top:10}}>
                <Image
                source={require('./assets/info.png')}
                ResizeMode='contain'
                style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#74144E' : '#748c94',
                }}/>  
                <Text style={{color:focused ? '#74144E' : '#748c94', fontSize:12}}>INFORMATION</Text>
            
            </View>
        ),
    }}/>
  </Tab.Navigator>
  )
}

export default Tabs
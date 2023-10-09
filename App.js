import React, { useEffect, useRef, useState } from 'react';
import { Alert, AppState, View, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/Splash';
import FirstPage from './src/FirstPage';
import SignUp from './src/SignUp';
import SignIn from './src/SignIn';
import MainPage from './src/MainPage';
import MyProfile from './src/MyProfile';
import Tabs from './src/Tabs';
import Info from './src/Info';
import ChangePassword from './src/ChangePassword';
import { Audio } from 'expo-av';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import { AuthProvider } from './src/AuthProvider';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import axios from 'axios';
import { encode } from 'base-64';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


const Stack = createNativeStackNavigator();
const auth = getAuth();
const db = getDatabase();


function App() {
  const alertRef = useRef(null);
  const [lastAlertTime, setLastAlertTime] = useState(null);

  const [emergencyPhone, setEmergencyPhone] = useState('');

  const SampleTrack = require('./src/assets/alert1.mp3');
  const [Loaded, SetLoaded] = React.useState(false);
  const [Loading, SetLoading] = React.useState(false);
  const sound = React.useRef(new Audio.Sound());
  const [alertVisible, setAlertVisible] = useState(false);

  const [timerId, setTimerId] = useState(null);
  const [isAlarmSounding, setIsAlarmSounding] = useState(false);
  const [alarmSoundTimerId, setAlarmSoundTimerId] = useState(null);

  const accountSid = 'AC42ed10430d74578bcb05f02bfe6b9fff';
  const authToken = '738e4d6c3c132162a901ed113a29d2ef';

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = ref(db, `users/${uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const emergencyPhoneNumber = data.emergencyPhone || '';
            setEmergencyPhone(emergencyPhoneNumber);
          }
        });
      } else {
        setEmergencyPhone('');
      }
    });
  }, []);

  useEffect(() => {
    LoadAudio();
    console.log('Emergency Phone:', emergencyPhone);

    if (emergencyPhone !== '') {
      const handleAccelerometerChange = ({ x, y, z }) => {
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        const gyroscope = Math.sqrt(x * x + y * y + z * z);

        if (acceleration > 3 && gyroscope > 3 && !lastAlertTime) {
              setTimeout(() => {
              handleOption3();
              dismissAlert(alertRef.current);
            }, 40000)

          alertRef.current = Alert.alert(
            'Alert!',
            'ARE YOU OK?',
            [
              { text: 'YES', onPress: handleOption1 },
              { text: 'Call 112', onPress: handleOption4 },
              { text: 'Send SMS', onPress: handleOption2 },
            ],
            { cancelable: false }

            
          );

          setLastAlertTime(Date.now());
          PlayAudio();
          setIsAlarmSounding(true);

            
        }
      };
      const handleOption1 = async () => {
        PauseAudio();
      };

      const handleOption2 = async () => {
        PauseAudio();
        const isAvailable = await SMS.isAvailableAsync();

        if (isAvailable) {
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const location = await Location.getCurrentPositionAsync({});
              const { latitude, longitude } = location.coords;
              const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
              const message = 'Hello! I need your help!';
              const result = await SMS.sendSMSAsync(emergencyPhone, `${message} ${googleMapsLink}`);

              if (result === 'sent') {
                console.log('SMS-ul a fost trimis cu succes!');
              } else {
                console.log('A apărut o eroare la trimiterea SMS-ului.');
              }
            } else {
              console.log('Permission to access location was denied.');
            }
          } catch (error) {
            console.log('Error occurred while retrieving location:', error);
          }
        } else {
          console.log('Dispozitivul nu suportă trimiterea de SMS-uri.');
        }
      };

      const handleOption3 = async () => {
        PauseAudio();
        try {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const message = 'Hello! I need your help! Here is my location: ' + googleMapsLink;
          const encodedMessage = encodeURIComponent(message);
          const credentials = encode(`${accountSid}:${authToken}`);
          const response = await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            `From=+13613091375&To=${emergencyPhone}&Body=${encodedMessage}`,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${credentials}`,
              },
            }
          );
    
          // Check if the response contains data
          if (response.data) {
            // Handle successful response
            console.log('Message sent:', response.data);
          } else {
            // Handle unexpected response
            console.log('Unexpected response:', response);
          }
        } catch (error) {
          // Log the error response
          console.log('Error sending message:', error.response?.data);
          Alert.alert('Error', error.message);
        }

       }

       const handleOption4 = async () => {
          PauseAudio();
        const phoneNumber = '112'; // Numărul de telefon către care să faci apel
      
        const handleCall = () => {
          const telUrl = `tel:${phoneNumber}`;
          Linking.openURL(telUrl);
        };
      
        handleCall();
      
      };

      Accelerometer.addListener(handleAccelerometerChange);
      return () => {
        PauseAudio();
        Accelerometer.removeAllListeners();
        clearTimeout(timerId);
        clearTimeout(alarmSoundTimerId);
      };
    }
  }, [emergencyPhone, lastAlertTime, isAlarmSounding]);

  const dismissAlert = (currentAlertRef) => {
    if (currentAlertRef) {
      currentAlertRef.dismiss();
      setAlertVisible(false); // Hide the alert
    }
  };

  const PlayAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === false) {
          sound.current.playAsync();
        }
      }
    } catch (error) {}
  };

  const PauseAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          sound.current.pauseAsync();
        }
      }
    } catch (error) {}
  };

  const LoadAudio = async () => {
    SetLoading(true);
    const checkLoading = await sound.current.getStatusAsync();
    if (checkLoading.isLoaded === false) {
      try {
        const result = await sound.current.loadAsync(SampleTrack, {}, true);
        if (result.isLoaded === false) {
          SetLoading(false);
          console.log('Error in Loading Audio');
        } else {
          SetLoading(false);
          SetLoaded(true);
        }
      } catch (error) {
        console.log(error);
        SetLoading(false);
      }
    } else {
      SetLoading(false);
    }
  };

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="FirstPage" component={FirstPage} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="MainPage" component={MainPage} />
          <Stack.Screen name="MyProfile" component={MyProfile} />
          <Stack.Screen name="Info" component={Info} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;

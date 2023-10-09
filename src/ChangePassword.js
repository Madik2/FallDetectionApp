import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import { Header } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Btn from './Btn';
import { getDatabase, ref, onValue, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = getDatabase();
const auth = getAuth();

const ChangePassword = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isFocused,setIsFocused] = React.useState(false);
  const [error, setError] = React.useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const retrieveUserProfile = async () => {
      try {
        const userProfileData = await AsyncStorage.getItem('userProfile');
        if (userProfileData) {
          const userProfile = JSON.parse(userProfileData);
          setPassword(userProfile.password || '');
          setIsLoggedIn(true);
          setUid(userProfile.uid || '');
          console.log('userProfile.password:', userProfile.password);
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
            password: password || data.password,
            uid: uid
          };
          setPassword(updatedData.password);
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
        setPassword('');
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
    retrieveUserProfile();
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    if (isLoggedIn) {
      console.log('Utilizatorul este logat');
      console.log('Datele despre utilizator:', {
        password,
        uid // Utilizează uid în scopul mai larg al componentei
      });
      // Trimite datele despre utilizator către o altă componentă
    }
  }, [isLoggedIn, password, uid]);

  const handlePasswordUpdate = () => {

    console.log("handlePasswordUpdate called"); // Add this line to check if the function is being called
    const userRef = ref(db, `users/${uid}`);
    update(userRef, { password: newPassword }).then(() => {
      console.log("Password updated successfully"); // Add this line to check if the phone number is being updated in the database
      setPassword(newPassword);
      console.log('Password state:', password);
    }).catch((error) => {
      console.log("Error updating password:", error); // Add this line to log any errors that occur during the update
    });
  };

  const handleConfirmPasswordUpdate = () => {
    console.log("handleConfirmPasswordUpdate called"); // Add this line to check if the function is being called
    const userRef = ref(db, `users/${uid}`);
    console.log(password);
    update(userRef, { confirmPassword: confirmPassword }).then(() => {
      console.log("Confirm Password updated successfully"); // Add this line to check if the phone number is being updated in the database
      setConfirmPassword(confirmPassword);
      console.log('Confirm Password state:', confirmPassword);
    }).catch((error) => {
      console.log("Error updating confirm password:", error); // Add this line to log any errors that occur during the update
    });
    
  };

  handleUpdate = () => {
    console.log(currentPassword);
    console.log(newPassword);
    console.log(password);
    if (newPassword !== confirmPassword) {
      console.log(error);
      console.log(confirmPassword);
      setError('Passwords do not match');
      return;
    }

    if (password !== currentPassword) {
      console.log(error);
      console.log('currentPassword:', currentPassword);
      console.log('password:', password);
      setError('Current Password Invalid')
      return;
      
    }
    if (newPassword == confirmPassword && password == currentPassword && newPassword && currentPassword && confirmPassword )
    {
      setError('');
      handlePasswordUpdate();
      handleConfirmPasswordUpdate();
    }
  }

    return (
      <View>
        <View>
        <Header
          leftComponent={
            <TouchableOpacity onPress={() => navigation.navigate('Tabs', { screen: 'MyProfile' })}>
              <Image source={require('./assets/left.png')} style={{ width: 24, height: 30,  }} />
            </TouchableOpacity>
          }
          centerComponent={{ text: 'Password', 
            style: { fontWeight: 'bold', color: '#fff', fontSize: 22 } 
          }}
          backgroundColor='#74144E'
          containerStyle={{ height: 140 }}
        />
      </View>
      <View style={styles.input}>
        <Text style={styles.text}>CURRENT</Text>
        <TextInput
          style={styles.textinput}
          placeholder="Enter your current password"
          onFocus={() => setIsFocused(false)}
          onBlur={() => setIsFocused(false)}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <Text style={styles.text}>NEW</Text>
        <TextInput
          style={styles.textinput}
          placeholder="Enter your new password"
          onFocus={() => setIsFocused(false)}
          onBlur={() => setIsFocused(false)}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <Text style={styles.text}>CONFIRM</Text>
        <TextInput
          style={styles.textinput}
          placeholder="Confirm your new password"
          onFocus={() => setIsFocused(false)}
          onBlur={() => setIsFocused(false)}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.text}></Text>
        <Btn bgColor = '#74144E' textColor='white' btnLabel="Save" Press={handleUpdate}/>
      </View>
      </View>
  );
}

const styles = StyleSheet.create({ 
  input: {
    alignSelf: 'stretch',
  },

  textinput: {
    alignSelf: 'stretch',
    height: 40,
    borderBottomColor: '#748c94',
    borderBottomWidth: 1,
    marginHorizontal: 40,
    flexDirection: 'row',
    color: "#1F456E",
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  text: {
    alignSelf: 'stretch',
    height: 20,
    fontSize: 12,
    color: '#748c94',
    marginHorizontal: 40,
    marginTop: 44,
    fontWeight: 'bold',
  },
  error: {
    color: '#D21404',
    marginHorizontal: 40,
    marginTop: 12
  },


})
export default ChangePassword
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity, onPress, TouchableWithoutFeedback, onFocus } from 'react-native';
import { getDatabase, ref, onValue, update, get, exists } from "firebase/database";
import { getAuth, onAuthStateChanged, deleteUser, signOut } from "firebase/auth";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = getDatabase();
const auth = getAuth();

function MyProfile({route}) {
   
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [editable, setEditable] = useState(false);
  const [emergencyEditable, setEmergencyEditable] = useState(false);

  const [displayPhone, setDisplayPhone] = useState('');
  const [displayPhoneEmergency, setDisplayPhoneEmergency] = useState('');

  const editIcon = editable ? require('./assets/yes.png') : require('./assets/edit1.png');
  const editIcon1 = emergencyEditable ? require('./assets/yes.png') : require('./assets/edit1.png');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState('');

  const navigation = useNavigation();
  
  useEffect(() => {
    const retrieveUserProfile = async () => {
      try {
        const userProfileData = await AsyncStorage.getItem('userProfile');
        if (userProfileData) {
          const userProfile = JSON.parse(userProfileData);
          setFullName(userProfile.fullName || '');
          setEmail(userProfile.email || '');
          setPhoneNumber(userProfile.phone || '');
          setEmergencyPhone(userProfile.emergencyPhone || '');
          setPassword(userProfile.password || '');
          setDisplayPhone(userProfile.phone || '');
          setDisplayPhoneEmergency(userProfile.emergencyPhone || '');
          setIsLoggedIn(true);
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
            email: email || data.email,
            phone: phone || data.phone,
            emergencyPhone: emergencyPhone || data.emergencyPhone,
            password: password || data.password,
            uid: uid
          };
  
          setFullName(updatedData.fullName);
          setEmail(updatedData.email);
          setPhoneNumber(updatedData.phone);
          setEmergencyPhone(updatedData.emergencyPhone);
          setPassword(updatedData.password);
          setDisplayPhone(updatedData.phone);
          setDisplayPhoneEmergency(updatedData.emergencyPhone);
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
  useEffect(() => {
    if (isLoggedIn) {
      console.log('Utilizatorul este logat');
      console.log('Datele despre utilizator:', {
        fullName,
        email,
        phone,
        emergencyPhone,
        password,
        uid // Utilizează uid în scopul mai larg al componentei
      });
      // Trimite datele despre utilizator către o altă componentă
    }
  }, [isLoggedIn, fullName, email, phone, emergencyPhone, password, uid]);


  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'FirstPage' }],
      });
      await SecureStore.deleteItemAsync('userToken');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const clearPhone = () => {
    setPhoneNumber('');
    setEditable(true);
  };

  const clearEmergencyPhone = () => {
    setEmergencyPhone('');
    setEmergencyEditable(true);
  };

  const handleOnSubmitEditing = () => {
    setEditable(false);
    setPhoneNumber(displayPhone);
    setEmergencyEditable(false);
    setEmergencyPhone(displayPhoneEmergency);
    console.log('New phone number:', displayPhone);
  }

  const handlePhoneUpdate = () => {
    console.log("handlePhoneUpdate called"); // Add this line to check if the function is being called
    const userRef = ref(db, `users/${uid}`);
    update(userRef, { phone: phone }).then(() => {
      console.log("Phone number updated successfully"); // Add this line to check if the phone number is being updated in the database
      setEditable(false);
      setPhoneNumber(phone);
      console.log('Phone number state nou:', phone);
      console.log('Phone number state vechi:', displayPhone);
    }).catch((error) => {
      console.log("Error updating phone number:", error); // Add this line to log any errors that occur during the update
    });
  };

  const handlePhoneUpdateEmergency = () => {
    console.log("handlePhoneUpdate called");
    console.log('uidbun', uid);
    const userRef = ref(db, `users/${uid}`);
    update(userRef, { emergencyPhone: emergencyPhone }).then(() => {
      console.log("Phone number updated successfully");
      setEmergencyPhone(emergencyPhone);
      setEmergencyEditable(false);
      console.log('Phone number state:', emergencyPhone);
      console.log('Phone number state:', displayPhoneEmergency);
    }).catch((error) => {
      console.log("Error updating phone number:", error); 
    });
  };

  const TextButton = ({ title, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
<View>
      <View style={styles.input}>
        <Text style={styles.text}>EMAIL</Text>
        <TextInput
          style={styles.textinput}
          placeholder={email}
          placeholderTextColor='#1F456E'
          editable={false}
        />
      </View>
      <View style={styles.input}>
        <Text style={styles.text}>PHONE NUMBER</Text>
        <TextInput 
          style={[styles.textinput, { color: editable ? '#1F456E' : '#1F456E' }]}
          defaultValue={phone}
          onChangeText={setPhoneNumber}
          placeholderTextColor='#1F456E'
          editable={editable}
          onSubmitEditing={handleOnSubmitEditing}   
        //}
        />
        {editable ? (
         <TouchableOpacity onPress={handlePhoneUpdate}>
          <Image
            source={editIcon}
            style={styles.icon}
            resizeMode="contain" 
          />
        </TouchableOpacity>
        ) : ( 
          <TouchableOpacity onPress={clearPhone}>
            <Image
            source={editIcon}
            style={styles.icon}
            resizeMode="contain" 
          />
          </TouchableOpacity>
        )}
        </View>
      <View style={styles.input}>
        <Text style={styles.text}>EMERGENCY PHONE NUMBER</Text>
        <TextInput
          style={[styles.textinput, { color: emergencyEditable ? '#1F456E' : '#1F456E' }]}
          defaultValue={emergencyPhone}
          onChangeText={setEmergencyPhone}
          placeholderTextColor='#1F456E'
          editable={emergencyEditable}
          onSubmitEditing={handleOnSubmitEditing}
        />
       {emergencyEditable ? (
         <TouchableOpacity onPress={handlePhoneUpdateEmergency}>
          <Image
            source={editIcon1}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        ) : ( 
          <TouchableOpacity onPress={clearEmergencyPhone}>
            <Image
            source={editIcon1}
            style={styles.icon}
            resizeMode="contain" 
          />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text style={styles.text}>PASSWORD</Text>
        <TextInput
          style={styles.textinput}
          defaultValue={password}
          placeholderTextColor='#1F456E'
          editable={false}
          secureTextEntry = {true}
        />
        <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
            <Image
            source={require('./assets/right.png')}
            style={styles.iconRight}
            resizeMode="contain" 
          />
          </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TextButton title="Log Out" onPress={handleLogOut} />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    alignSelf: 'stretch',
    height: 20,
    fontSize: 12,
    color: '#748c94',
    marginHorizontal: 40,
    marginTop: 44,
    fontWeight: 'bold',
  },

  textDelete: {
    alignSelf: 'stretch',
    height: 20,
    fontSize: 13,
    color: '#D21404',
    marginHorizontal: 40,
    marginTop: 44,
    fontWeight: 'bold',
  },

  textinput: {
    alignSelf: 'stretch',
    height: 40,
    borderBottomColor: '#748c94',
    borderBottomWidth: 1,
    marginHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  input: {
    alignSelf: 'stretch',
  },

  iconRight: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    width: 100,
    height: 16,
    zIndex: 1,
    resizeMode: 'contain'
  }, 

  icon: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    width: 100,
    height: 22,
    zIndex: 1,
    resizeMode: 'contain'
  },

  buttonContainer: {
    marginLeft: 42,
    marginTop: 44,
  },

  buttonText: {
    fontWeight: 'bold',
    color: '#0055ff',
    fontSize: 16,
  },
});
export default MyProfile;
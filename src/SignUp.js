import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, Alert, Platform, TouchableWithoutFeedback, Keyboard, Dimensions, ScrollView} from 'react-native';
import { myColor } from './Constants';
import Input from './Input';
import Btn from './Btn';
import React from 'react';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged }  from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './Firebase/firebase-config';
import { ref, set } from 'firebase/database';
import { getDatabase } from 'firebase/database';

const SignUp = () => {
    const MIN_NAME_LENGTH = 4;
    const MAX_NAME_LENGTH = 15;
    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [emergencyPhone, setEmergencyPhone] = React.useState('');
    const [error, setError] = React.useState('');
    const [emailError, setEmailError] =React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
    const [phoneError, setPhoneError] = React.useState('');
    const [fullNameError, setFullNameError] = React.useState('');
    const [emergencyPhoneError, setEmergencyPhoneError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');


    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);


    const handleCreateAccount = () => {
        setEmailError('');
        setConfirmPasswordError('');
        setPasswordError('');
        setPhoneError('');
        setFullNameError('');
        setEmergencyPhoneError('');

        if (fullName.length < MIN_NAME_LENGTH || fullName.length > MAX_NAME_LENGTH) {
          setFullNameError(`Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`);
          return;
        }
        if (!nameRegex.test(fullName)) {
          setFullNameError('Name cannot contain special characters.');
          return;
        }
        if (!email) {
            setEmailError('Email is required');
          }
        if (!confirmPassword) {
            setConfirmPasswordError('Confirm password is required');
          }
          if (!phone) {
            setPhoneError('Phone number is required');
          } else if (phone.length < 7 || phone.length > 15) {
            setPhoneError('Phone number must be between 7 and 15 digits');
          }
        if (!fullName) {
            setFullNameError('Full Name is required');
          }
          if (!emergencyPhone) {
            setEmergencyPhoneError('Emergency Phone Number is required');
          } else if (emergencyPhone.length < 7 || emergencyPhone.length > 15) {
            setEmergencyPhoneError('Emergency Phone Number must be between 7 and 15 digits');
          }
          if (phone === emergencyPhone) {
            setPhoneError('Phone number and Emergency Phone number cannot be the same');
            return;
          }
          if (!password) {
            setPasswordError('Password is required'); 
          }
          if (password !== confirmPassword) {
            console.log(error)
            setError('Passwords do not match');
            return;
          }
          if (password.length < 4 || password.length > 15) {
            setPasswordError('Password must be between 4 and 15 characters.');
            return;
          }
        if (password == confirmPassword && email && confirmPassword && phone && fullName && emergencyPhone && password) {
            setError('');
            createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Account created!')
            const user = userCredential.user;
            console.log(user)

            onAuthStateChanged(auth, (user) => {
              if (user) {
                const uid = user.uid;
                set(ref(db, `users/${uid}`), {
                  fullName: fullName,
                  email: email,
                  phone: phone,
                  emergencyPhone: emergencyPhone,
                  password: password,
                  confirmPassword: confirmPassword,
                })
                  .then(() => {
                    console.log("Data added successfully!");
                    Alert.alert('Success', 'Account created successfully!');
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            });
        
        })
        .catch(error => {
            let errorCode = error.code;
            let errorMessage = error.message;
            if (errorCode === 'auth/email-already-in-use') {
                Alert.alert('Email Already in Use', 'The email address you entered is already in use');
              } else if (errorCode === 'auth/invalid-email') {
                Alert.alert('Invalid Email', 'The email address you entered is invalid');
              } else if (errorCode === 'auth/weak-password') {
                Alert.alert('Weak Password', 'The password you entered is too weak. Enter at least 6 characters');
              } else if (errorCode === 'auth/operation-not-allowed') {
                Alert.alert('Sign Up Not Allowed', 'Sign up is not enabled for this Firebase project');
              } else if (errorCode === 'auth/too-many-requests') {
                Alert.alert('Too Many Requests', 'Sign up has been blocked due to unusual activity');
              }else if (errorCode == 'auth/missing-password') {
                console.log(error)
                setError('');
              } else if (errorCode == 'auth/missing-email') {
                console.log(error)
                setError('');
              }
              else {
                Alert.alert('Error', errorMessage);
              }
        })
        }
        
    }

    return (  
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
        <ScrollView>
        <View>
        <Text style={styles.header}> SIGN UP</Text>
        </View>

        <View style={styles.textInput}>
        <Input
              style={[
                styles.Input,
                fullNameError && styles.errorInput,
              ]}
              value={fullName}
              onChangeText={(text) => setFullName(text)}
              placeholder="Please type in your full name"
              label="Full Name"
              maxLength={MAX_NAME_LENGTH}
            />
            {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null }

            <Input
            style={[styles.Input, emailError && styles.errorInput]}
            value={email}
            onChangeText = {(text) => setEmail(text)}
            keyboardType="email-address"
            placeholder= "Please type in your email address"
            label="Email"
            />
             {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null }
            <Input
            style={[styles.Input, phoneError && styles.errorInput]}
            value={phone}
            keyboardType="numeric"
            onChangeText = {(text) => setPhone(text)}
            placeholder= "Please type in your phone number"
            label="Phone"
            />
             {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null }
            <Input 
            style={[styles.Input, emergencyPhoneError && styles.errorInput]}
            value={emergencyPhone}
            keyboardType="numeric"
            onChangeText = {(text) => setEmergencyPhone(text)}
            placeholder= "Please type in your emergency phone number "
            label="Emergency Phone"
            />
             {emergencyPhoneError ? <Text style={styles.errorText}>{emergencyPhoneError}</Text> : null }
            <Input 
            style={[styles.Input, passwordError && styles.errorInput]}
            value={password}
            onChangeText = {(text) => setPassword(text)}
            placeholder= "Please type in your password"
            label="Password"
            secureTextEntry
            password
            />
             {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null }
            <Input 
            style={[styles.Input, confirmPasswordError && styles.errorInput]}
            value={confirmPassword}
            onChangeText = {(text) => setConfirmPassword(text)}
            placeholder= "Please type in your password again"
            label="Confirm Password"
            secureTextEntry
            password
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null }
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <View>
        <Btn bgColor = '#74144E' textColor='white' btnLabel="Register" Press={handleCreateAccount} /> 
        </View>
        </ScrollView>
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView> 
    );
};

const styles = StyleSheet.create({
    container: {
        //width: Dimensions.get('window').width,
        flex: 1,
    },
    header: {
            color: myColor,
            fontSize: 32,
            fontFamily: 'System',
            fontWeight: "bold",
            marginTop:89,
            textAlign:'left',
            paddingLeft:16

    },
    errorText: {
        marginBottom: 2,
        color: '#D21404',
        marginLeft: 24,
      },
    errorInput: {
        borderColor: 'red',
    },

    textInput: {
        marginVertical: 24,
    },

    error: {
        color: '#D21404',
        marginHorizontal: 12,

      },

});

export default SignUp;

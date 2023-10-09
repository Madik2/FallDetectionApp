import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

const Info = () => {
  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('./assets/second2.png')}
            style={styles.photo}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.description, styles.boldText]}>FIND YOUR HOSPITAL</Text>
          <Text style={styles.smallText}>Search and locate hospitals near you</Text>
        </View>
      </View>
      <View style={styles.photoContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('./assets/third3.png')}
            style={styles.photo}
          />
        </View>
        <View style={[styles.textContainer, styles.textContainerMargin]}>
          <Text style={[styles.description, styles.boldText, styles.descriptionMargin]}>DID YOU FALL?</Text>
          <Text style={styles.smallText}>Report if you have fallen and need assistance</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 10,
  },
  photo: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginLeft: 10,
    marginTop: 20, // Adăugați o margine superioară la containerul textului pentru a muta textul mai jos
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 12,
    textAlign: 'left',
    color: 'gray',
  },
});


export default Info
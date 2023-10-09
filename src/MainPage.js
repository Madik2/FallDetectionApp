import React, {useState, useEffect, useRef} from 'react';
import MapView, {PROVIDER_GOOGLE, LatLng, Marker, Polyline} from 'react-native-maps';
import { Dimensions, StyleSheet, View, Button, Text } from 'react-native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from './enviroments';
import Constants from 'expo-constants';
import { getDistance } from 'geolib';
import MapViewDirections from 'react-native-maps-directions';


const { width, height} = Dimensions.get("window");
const ASPECT_RATIO = width/height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export default function MainPage() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const [hospitals, setHospitals] = useState([]);
  const [mapRegion, setMapRegion] =useState ({
    latitude: 46.74642706243099,
    longitude: 23.57135556181713,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const userLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if ( status !== 'granted') {
      setErrorMsg('Permision to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({enebleHighAccuracy: true});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    console.log(location.coords.latitude, location.coords.longitude);
    let response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=6000&&keyword=clinica|spital|hospital&type=clinica,spital,hospital&key=${GOOGLE_API_KEY}`
    );
    let data = await response.json();
    setHospitals(data.results);
  }

  useEffect(() => {
    userLocation();
  }, []);

  const handleMarkerPress = (marker) => {
    setDestination({
      latitude: marker.geometry.location.lat,
      longitude: marker.geometry.location.lng,
    });
  };

  const handleDirectionsReady = async (result) => {
    if (result?.coordinates?.length > 0) {
      const origin = result.coordinates[0];
      const destination = result.coordinates[result.coordinates.length - 1];
  
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();
  
        const { duration, distance } = data.routes[0].legs[0];
        console.log('Duration:', duration.text);
        console.log('Distance:', distance.text);
        setDistance(distance.text);
        setDuration(duration.text);
      } catch (error) {
        console.error('Error fetching directions:', error);
      }
    } else {
      console.log('No duration or distance data available');
      setDistance(null);
      setDuration(null);
    }
  };
 
  return (
       <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        zoomControlEnabled={true}
        zoomEnabled={true}
        moveOnMarkerPress={false}
        toolbarEnabled={true}
        loadingEnabled={true}
        mapType={'standard'}
        legalLabelInsets={{ bottom: 10 }}
        onMapReady={() => {
          console.log('Map is ready!');
        }}
      >
        {origin && <Marker coordinate={origin} title="My Location" pinColor="blue" />}
        {destination && <Marker coordinate={destination} title="Destination" pinColor="red" />}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.place_id}
            coordinate={{
              latitude: hospital.geometry.location.lat,
              longitude: hospital.geometry.location.lng,
            }}
            title={hospital.name}
            onPress={() => handleMarkerPress(hospital)}
          />
        ))}
        {origin ? (
        <Marker
          coordinate={origin}
          title="My Location"
          pinColor="blue"
        />
        ) : (
        mapRegion.latitude && (
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
            title="My Location"
            pinColor="blue"
            onPress={() => setOrigin({ latitude: mapRegion.latitude, longitude: mapRegion.longitude })}
              />
            )
          )}

        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={3}
            strokeColor="blue"
            onReady={handleDirectionsReady}
          />
        )}
      </MapView>
      {distance && duration && (
      <View style={styles.infoContainer}>
        <Text style={styles.textContainer}>DRIVING</Text>
        <Text>Distance: {distance}</Text>
        <Text>Duration: {duration}</Text>
      </View>
    )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  textContainer: {
    fontWeight: 'bold',
  },
});
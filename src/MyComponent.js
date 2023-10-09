import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

const MyComponent = () => {
  const audioPlayer = useRef(null);
  const [alertSoundPlaying, setAlertSoundPlaying] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState(null);

  useEffect(() => {
    // Create a new instance of Audio.Sound
    audioPlayer.current = new Audio.Sound();

    // Handle accelerometer change
    const handleAccelerometerChange = ({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      if (acceleration > 3 && !lastAlertTime && !alertSoundPlaying) {
        Alert.alert(
          'Alert',
          'Accelerometer value exceeds 3G',
          [
            { text: 'Option 1', onPress: handleOption1 },
            { text: 'Option 2', onPress: () => console.log('Option 2 pressed') },
          ],
          { cancelable: false }
        );

        setLastAlertTime(Date.now());
        playSound();
        setAlertSoundPlaying(true);
      }
    };

    // Handle Option 1 press
    const handleOption1 = () => {
      stopSound();
    };

    // Start listening to accelerometer changes
    Accelerometer.addListener(handleAccelerometerChange);

    return () => {
      // Clean up by unloading the audio player and removing accelerometer listener
      stopSound();
      Accelerometer.removeAllListeners();
    };
  }, [lastAlertTime, alertSoundPlaying]);

  const playSound = async () => {
    try {
      await audioPlayer.current.unloadAsync();
      await audioPlayer.current.loadAsync(require("./src/alert1.mp3"));
      await audioPlayer.current.playAsync();
    } catch (err) {
      console.warn("Couldn't play audio", err);
    }
  };

  const stopSound = async () => {
    if (audioPlayer.current && alertSoundPlaying) {
      await audioPlayer.current.stopAsync();
      setAlertSoundPlaying(false);
    }
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};

export default MyComponent;

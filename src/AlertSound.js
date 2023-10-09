import { Audio } from 'expo-av';

export const AlertSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/alert1.mp3'),
      { shouldPlay: true }
    );
    return sound;
  } catch (error) {
    console.log('Error playing sound: ', error);
    return null;
  }
};



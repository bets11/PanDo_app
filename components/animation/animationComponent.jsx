import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animation from '../components/animation'; // Komponente für die Spritesheet-Animation

export default function AnimationComponent({ message, spritesheet, frameWidth, frameHeight, totalFrames, duration }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Animation
        spritesheet={require('./assets/spritesheet.png')}
        frameWidth={200} // Breite eines Frames
        frameHeight={500} // Höhe eines Frames
        totalFrames={4} // Anzahl der Frames
        duration={2000} // Dauer für eine komplette Animation
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

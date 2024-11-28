import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animation from '../components/animation';

export default function AnimationComponent({ message, spritesheet, frameWidth, frameHeight, totalFrames, duration }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Animation
        spritesheet={require('./assets/spritesheet.png')}
        frameWidth={200} 
        frameHeight={500} 
        totalFrames={4} 
        duration={2000} 
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

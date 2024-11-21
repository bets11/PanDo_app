import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Ball = ({ position }) => {
  return (
    <Image 
    source={require('../../assets/pandaProfil.png')}
    style={[styles.ball, { top: position.y, left: position.x }]} />
  );
};

const styles = StyleSheet.create({
  ball: {
    width: 30, 
    height: 30,
    position: 'absolute',
  },
});

export default Ball;
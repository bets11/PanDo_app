import React from 'react';
import { View, StyleSheet } from 'react-native';

const Paddle = ({ position }) => {
  return (
    <View style={[styles.paddle, { left: position.x }]} />
  );
};

const styles = StyleSheet.create({
  paddle: {
    position: 'absolute',
    bottom: 30, 
    width: 100, 
    height: 20, 
    backgroundColor: 'black', 
  },
});

export default Paddle;
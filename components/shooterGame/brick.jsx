import React from 'react';
import { View, StyleSheet } from 'react-native';

const Brick = ({ position, width, height }) => {
  return (
    <View style={[styles.brick, { top: position.y, left: position.x, width, height }]} />
  );
};

const styles = StyleSheet.create({
  brick: {
    position: 'absolute',
    backgroundColor: '#f7e79e', 
    borderWidth: 1,
    marginTop:30,
  },
});

export default Brick;
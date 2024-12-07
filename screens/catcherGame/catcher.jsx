import React from 'react';
import { Animated, StyleSheet, PanResponder, Image } from 'react-native';

const catcherSize = 150;

const Catcher = ({ position, onMove }) => {
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPosition = Math.max(0, Math.min(gestureState.moveX - catcherSize / 2, position.maxWidth));
      onMove(newPosition); 
    },
  });

  return (
    <Animated.View {...panResponder.panHandlers} style={{ position: 'absolute', bottom: 0 }}>
      <Animated.Image
        source={require('../../assets/baum.png')}
        style={[styles.catcher, { transform: [{ translateX: position.value }] }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  catcher: {
    width: catcherSize,
    height: catcherSize,
    resizeMode: 'contain',
  },
});

export default Catcher;

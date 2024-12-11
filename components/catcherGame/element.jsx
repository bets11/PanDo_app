import React from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

const elementSize = 100;

const Element = ({ xPosition, animation, type }) => {
  return (
    <Animated.View
      style={[
        styles.element,
        {
          transform: [{ translateY: animation }, { translateX: xPosition }],
        },
      ]}
    >
      <Image
        source={
          type === 'fallingPanda'
            ? require('../../assets/progress_col1.png')
            : require('../../assets/cat.png')
        }
        style={styles.image}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  element: {
    position: 'absolute',
    width: elementSize,
    height: elementSize,
  },
  image: {
    width: elementSize,
    height: elementSize,
    resizeMode: 'contain',
  },
});

export default Element;

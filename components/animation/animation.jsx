import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import Timer from '../common/timer';

export default function Animation({ message, imageSource, animationDuration = 4000, onAnimationEnd }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{message}</Text>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Image source={imageSource} style={styles.image} />
        </Animated.View>
      </View>
      <ConfettiCannon count={50} origin={{ x: 200, y: 0 }} fadeOut={true} />
      <Timer duration={animationDuration} onTimerEnd={onAnimationEnd} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

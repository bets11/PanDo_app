import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import Timer from '../common/timer';

export default function Animation({ message, imageSource, animationDuration = 4000, onAnimationEnd }) { // Setze Standardwert auf 4 Sekunden
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Image source={imageSource} style={styles.image} />
      </Animated.View>
      <ConfettiCannon count={50} origin={{ x: 0, y: 0 }} fadeOut={true} />
      <Timer duration={animationDuration} onTimerEnd={onAnimationEnd} /> {/* 4-Sekunden-Timer */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

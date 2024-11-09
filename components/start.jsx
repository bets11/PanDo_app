import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native';

export default function Start() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 5000);

    return () => clearTimeout(timer);
  }, [scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome Back!</Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Image
          source={require('../assets/panda.png')} 
          style={styles.pandaImage}
        />
      </Animated.View>
      <ConfettiCannon count={50} origin={{ x: -10, y: 0 }} fadeOut={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dffcbc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pandaImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

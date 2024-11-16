import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnimationComponent from '../components/animation/animation';
import Timer from '../components/common/timer';
import { useNavigation } from '@react-navigation/native';

export default function Start() {
  const navigation = useNavigation();

  const handleTimerEnd = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <AnimationComponent 
        message="Welcome Back!"
        imageSource={require('../assets/panda.png')}
      />
      <Timer duration={5000} onTimerEnd={handleTimerEnd} />
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
});

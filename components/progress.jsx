import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Animated, TouchableOpacity, SafeAreaView } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native';

export default function Progress() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [showAnimation, setShowAnimation] = useState(true);
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [scaleAnim]);

  return (
    <View style={[styles.container, !showAnimation && styles.orangeBackground]}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go back...</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {showAnimation ? (
  <>
    <Text style={styles.congratsText}>Great Job!</Text>
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Image
        source={require('../assets/panda.png')}
        style={styles.pandaImage}
      />
    </Animated.View>
    <ConfettiCannon count={50} origin={{ x: -10, y: 0 }} fadeOut={true} />
  </>
) : (
  <>
    <Text style={styles.progressText}>PanDo</Text>
    <Image source={require('../assets/pandaProgress.png')} style={styles.progressPanda} />
  </>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dffcbc',
  },
  orangeBackground: {
    backgroundColor: '#f9cf9c', 
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pandaImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  progressPanda: {
    width: 450,
    height: 450,
    resizeMode: 'contain',
  },
  progressText: {
    marginTop: 30, 
    fontWeight:'bold',
    fontSize:30,
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import Animation from '../components/animation/animation';
import GoBackButton from '../components/common/goBackButton';

export default function Progress() {
  const [showAnimation, setShowAnimation] = useState(true);

  const handleAnimationEnd = () => {
    setShowAnimation(false);
  };

  return (
    <View style={[styles.container, !showAnimation && styles.orangeBackground]}>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton/>
      </SafeAreaView>

      {showAnimation ? (
        <Animation 
          message="Great Job!"
          imageSource={require('../assets/panda.png')}
          animationDuration={4000}  
          onAnimationEnd={handleAnimationEnd} 
        />
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
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: 10,
  },
  progressText: {
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 30,
  },
  progressPanda: {
    width: 450,
    height: 450,
    resizeMode: 'contain',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import GoBackButton from '../../components/common/goBackButton';

const OverlayScreen = ({ gameState, onStart, onReset }) => {
  if (gameState === 'start') {
    return (
      <View style={styles.overlay}>
        <Text style={styles.title}>Catcher Game</Text>
        <Text style={styles.instructionTextTitle}> Catch all the pandas, do not touch any cats! 
        If you lose 3 pandas or catch 3 cats, you will lose</Text>
        <View style={styles.instructions}>
          <Image source={require('../../assets/progress_col1.png')} style={styles.instructionImage} />
          <Text style={styles.instructionText}>Pandas = Points</Text>
          <Image source={require('../../assets/cat.png')} style={styles.instructionImage} />
          <Text style={styles.instructionText}>Cats = Penalty</Text>
          <Image source={require('../../assets/baum.png')} style={styles.instructionImage} />
          <Text style={styles.instructionText}>Catcher for falling objects</Text>
          <TouchableOpacity onPress={onStart}>
          <Text style={styles.button}>Start Game</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (gameState === 'gameOver') {
    return (
      <View style={styles.overlay}>
        <Text style={styles.title}>Game Over</Text>
        <TouchableOpacity onPress={onReset}>
          <Text style={styles.button}>Restart</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20, 
    fontWeight: 'bold',
  },
  instructionTextTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 50, 
    textAlign: 'center',
  },
  instructions: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#EAF5D6',
    borderRadius: 10,
    width: 300,
  },
  instructionText: {
    fontSize: 16,
    color: '#2B3A30',
    marginVertical: 8,
    textAlign: 'center',
    marginBottom: 30,
  },
  instructionImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  button: {
    fontSize: 18,
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10, 
  },
});

export default OverlayScreen;

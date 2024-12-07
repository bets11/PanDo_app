import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScoreDisplay = ({ score, errors }) => {
  return (
    <View>
      <Text style={styles.score}>Points: {score}</Text>
      <Text style={styles.errors}>Penalties: {errors}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  score: {
    fontSize: 20, 
    position: 'absolute',
    top: 10,
    left: 20, 
    color: '#4CAF50',
    fontWeight: 'bold',
    alignItems: 'flex-end',
  },
  errors: {
    fontSize: 20,
    position: 'absolute',
    top: 40,
    left: 20,
    color: '#F44336',
    fontWeight: 'bold',
  },
});

export default ScoreDisplay;

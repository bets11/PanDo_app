import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { View } from 'react-native-web';

const ResetButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.resetButton}>
      <Text style={styles.resetButtonText}>Play again</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resetButton: {
    marginBottom: 250,
    padding: 10,
    backgroundColor: '#cbedd2',
    borderRadius: 5,
    width: 120,
    alignItems:'center',
    marginLeft: 155, 
  },
  resetButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight:'bold',
  },
});

export default ResetButton;

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ResetButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.resetButton}>
      <Text style={styles.resetButtonText}>Play again</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resetButton: {
    marginBottom: 270,
    padding: 10,
    backgroundColor: '#cbedd2',
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default ResetButton;

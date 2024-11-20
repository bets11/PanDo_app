import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AddMedicineButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress}>
      <Text style={styles.addText}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 40,
    height: 40, 
    borderRadius: 20,
    borderColor: '#000',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

export default function AddMedicineButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.addBox} onPress={onPress}>
      <Text style={styles.addText}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addBox: {
    width: Dimensions.get('window').width / 3 - 20,
    height: 80,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
  },
  addText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

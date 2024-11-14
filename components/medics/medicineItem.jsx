import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

export default function MedicineItem({ name, onPress }) {
  return (
    <TouchableOpacity style={styles.medicineBox} onPress={() => onPress(name)}>
      <Text style={styles.medicineText}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  medicineBox: {
    width: Dimensions.get('window').width / 3 - 20,
    height: 80,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
  },
  medicineText: {
    fontSize: 16,
  },
});

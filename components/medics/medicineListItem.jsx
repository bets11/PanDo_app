import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MedicineListItem({ medicine, onEdit, onDelete }) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.medicineName}>{medicine.name}</Text>
      <Text style={styles.medicineAmount}>{medicine.amount}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicineAmount: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionText: {
    fontSize: 18,
    marginHorizontal: 5,
  },
});

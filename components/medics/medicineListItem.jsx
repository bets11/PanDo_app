import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

export default function MedicineListItem({ medicine, onEdit, onDelete }) {
  const confirmDelete = () => {
    Alert.alert(
      'Confirm Delete', 
      'Are you sure you want to delete this medicine?', 
      [
        {
          text: 'Cancel', 
          style: 'cancel',
        },
        {
          text: 'Delete', 
          style: 'destructive',
          onPress: onDelete, 
        },
      ],
      { cancelable: true } 
    );
  };

  return (
    <View style={styles.itemContainer}>
      {medicine.image_url && (
        <Image
          source={{ uri: medicine.image_url }}
          style={styles.medicineImage}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.medicineName}>{medicine.name}</Text>
        <Text style={styles.medicineAmount}>{medicine.amount}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmDelete}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  medicineImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  medicineAmount: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
});

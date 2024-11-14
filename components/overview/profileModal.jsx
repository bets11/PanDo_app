import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';

export default function ProfileModal({ visible, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image source={require('../../assets/pandaProfil.png')} style={styles.profileImageLarge} />
          <Text style={styles.profileTitle}>Profile</Text>
          <Text style={styles.profileText}>Frau Pilgitsch</Text>
          <Text style={styles.profileText}>pilgitsch@example.com</Text>
          <Text style={styles.profileText}>21.04.2003</Text>
          <Text style={styles.profileText}>Illness</Text>
          <Text style={styles.profileText}>Medicines List</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align to the start of the screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  modalContent: {
    width: '80%', 
    height: '100%',
    backgroundColor: '#fdfdf0',
    padding: 20,
    borderRightWidth: 1,
    borderColor: '#000',
    alignItems: 'left',
  },
  profileImageLarge: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginLeft: 70,
    borderWidth: 1,
    marginBottom: 20,
    borderColor: '#000',
    backgroundColor: '#dffcbc',
    marginTop: 40,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 50,
  },
  profileText: {
    fontSize: 20,
    textAlign: 'left',
    marginBottom: 15,
    
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#dffcbc',
    alignItems: 'center',
    borderRadius: 5,
    width: '40%',
    alignSelf: 'left',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#000',

  },
});

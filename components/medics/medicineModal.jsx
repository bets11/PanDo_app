import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import InputField from '../common/inputField';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { uploadImage, deleteImage, listImages, saveMedicineToDatabase } from '../../services/imageService';
import { getUserUUID } from '../../services/storageService';

export default function MedicineModal({ visible, medicine, onClose, onSave }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (visible) {
      if (medicine) {
        setName(medicine.name || '');
        setAmount(medicine.amount || '');
        setImageUri(medicine.image || null);
      } else {
        setName('');
        setAmount('');
        setImageUri(null);
      }
    }
  }, [visible, medicine]);

  const handleSave = async () => {
    if (!name.trim()) return alert('Please enter medicine name');
    if (!amount.trim()) return alert('Please enter amount');
  
    let imageUrl = null;
  
    if (imageUri) {
      try {
        const userId = await getUserUUID();
        imageUrl = await uploadImage(imageUri, userId);
      } catch (error) {
        alert('Failed to upload image. Please try again.');
        return;
      }
    }
  
    const medicineData = {
      name,
      amount,
      image: imageUrl, 
    };
  
    onSave(medicineData);
  };
  
  

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        alert('Permission to access the camera is required to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      });
  
      if (!result.canceled) {
        setImageUri(result.assets ? result.assets[0].uri : result.uri);
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
      alert('An error occurred while trying to access the camera. Please try again.');
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.photoContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
                <Icon name="camera" size={30} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <InputField placeholder="Medicine Name" value={name} onChangeText={setName} />
          <InputField placeholder="Amount (e.g. 2x/day)" value={amount} onChangeText={setAmount} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
  },
  pandaWrapper: {
    position: 'absolute',
    top: -30, 
    alignItems: 'center',
    width: '100%',
  },
  pandaImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  photoContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden', 
    backgroundColor: '#f8f8f8', 
  },
  cameraButton: {
    backgroundColor: '#7A965B',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  inputField: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#C55F4D',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#7A965B',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});





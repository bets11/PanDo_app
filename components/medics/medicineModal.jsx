import React, { useState, useEffect } from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Modal,Image,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback,Platform,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import InputField from '../common/inputField';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { uploadImage } from '../../services/imageService';
import { getUserUUID } from '../../services/storageService';
import { supabase } from '../../lib/supabase';

export default function MedicineModal({ visible, medicine, onClose, onSave }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (visible) {
      if (medicine) {
        setName(medicine.name || '');
        setAmount(medicine.amount || '');
        setImageUri(medicine.image_url || null);
      } else {
        setName('');
        setAmount('');
        setImageUri(null);
      }
    }
  }, [visible, medicine]);

  const handleSave = async () => {
    if (!name.trim()) return alert('Please enter a medicine name');
    if (!amount.trim()) return alert('Please enter the amount');
    
    let imageUrl = null;
  
    try {
      const userId = await getUserUUID();
  
      if (imageUri && imageUri !== medicine?.image_url) {
        const uploadedUrl = await uploadImage(imageUri, userId);
        imageUrl = uploadedUrl.publicUrl;
      } else if (medicine?.image_url) {
        imageUrl = medicine.image_url;
      }
  
      const medicineData = {
        id: medicine?.id || undefined, // Use undefined for new medicine
        name,
        amount,
        user_id: userId,
        ...(imageUrl && { image_url: imageUrl }), // Only include image_url if it exists
      };
  
      console.log('Saving medicine:', medicineData);
  
      const { data, error } = await supabase
        .from('medications')
        .upsert(medicineData, { onConflict: 'id' })
        .select();
  
      if (error) throw error;
  

      console.log('raw image url:', data[0].image_url);
      const savedMedicine = {
        id: data[0].id,
        name: data[0].name,
        amount: data[0].amount,
        image_url: data[0].image_url && data[0].image_url.startsWith('{') // Check if it's JSON
        ? JSON.parse(data[0].image_url).publicUrl // Parse if JSON
        : data[0].image_url, // Use as-is if it's already a plain string
        user_id: data[0].user_id,
      };
  
      console.log('Saved image url:', savedMedicine.image_url);
      console.log('Saved medicine:', savedMedicine);
      onSave(savedMedicine); 
    } catch (error) {
      console.error('Error saving medicine:', error.message);
      alert('Failed to save medicine. Please try again.');
    }
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.photoContainer}>
              {imageUri ? (
                 <TouchableOpacity onPress={takePhoto} style={styles.imageContainer}>
                 <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                 <View style={styles.retakeOverlay}>
                   <Icon name="camera" size={24} color="#fff" />
                   <Text style={styles.retakeText}>Retake Photo</Text>
                 </View>
               </TouchableOpacity>
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
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  retakeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  retakeText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
});

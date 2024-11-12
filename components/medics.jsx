import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Medics() {
  const navigation = useNavigation();
  const [medicines, setMedicines] = useState(['Doxybene', 'Kreon']);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const toggleModal = (medicine) => {
    setSelectedMedicine(medicine);
    setModalVisible(!isModalVisible);
  };

  const addMedicine = () => {
    setMedicines([...medicines, `Medicine ${medicines.length + 1}`]);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go back...</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <Text style={styles.title}>Add your medicines</Text>
      <View style={styles.medicinesContainer}>
        {medicines.map((medicine, index) => (
          <TouchableOpacity
            key={index}
            style={styles.medicineBox}
            onPress={() => toggleModal(medicine)}
          >
            <Text style={styles.medicineText}>{medicine}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addBox} onPress={addMedicine}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMedicine}</Text>
            <Text style={styles.modalText}>Add necessary info here</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c0e8f6',
    padding: 20,
  },
  safeArea: {
    width: '100%',
    paddingLeft: 10,
    marginBottom: 15,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  medicinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#dffcbc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

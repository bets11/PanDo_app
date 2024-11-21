import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import GoBackButton from '../components/common/goBackButton';
import MedicineItem from '../components/medics/medicineItem';
import AddMedicineButton from '../components/medics/addMedicineButton';
import MedicineModal from '../components/medics/medicineModal';

export default function Medics() {
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton screen={'Overview'}/>
      </SafeAreaView>

      <Text style={styles.title}>Add your medicines</Text>

      <View style={styles.medicinesContainer}>
        {medicines.map((medicine, index) => (
          <MedicineItem key={index} name={medicine} onPress={toggleModal} />
        ))}
        <AddMedicineButton onPress={addMedicine}/>
      </View>

      <MedicineModal
        visible={isModalVisible}
        medicineName={selectedMedicine}
        onClose={() => setModalVisible(false)}
      />
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
  });
  

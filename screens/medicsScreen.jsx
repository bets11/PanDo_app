import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Image } from 'react-native';
import GoBackButton from '../components/common/goBackButton';
import MedicineModal from '../components/medics/medicineModal';
import MedicineListItem from '../components/medics/medicineListItem';
import AddMedicineButton from '../components/medics/addMedicineButton';
import { supabase } from '../lib/supabase';
import { getUserUUID } from '../services/storageService';
import { deleteImage } from '../services/imageService';


export default function Medics() {
  const [medicines, setMedicines] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const medicationImage = require('../assets/medication.webp'); 

  const fetchMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Data:', data);
      if (error) {
        console.error('Error fetching medicines:', error.message);
      } else {
        setMedicines(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching medicines:', error.message);
    }
  }

  useEffect(() => {
    fetchMedicines();
    console.log('Medicines:', medicines);
  }, []);

  const toggleModal = (medicine = null) => {
    setSelectedMedicine(medicine);
    setModalVisible(!isModalVisible);
  };

  const saveMedicine = async (medicine) => {
    console.log('Saving medicine:', medicine);

    try {
      const userId = await getUserUUID();
  
      const { data, error } = await supabase
        .from('medications')
        .insert({
          user_id: userId,
          name: medicine.name,
          amount: medicine.amount,
          image_url: medicine.image, 
        })
        .select();
  
      if (error) {
        console.error('Error saving medicine to database:', error.message);
        alert('Failed to save medicine. Please try again.');
        return;
      }

      if (!data || data.length === 0) {
        console.error('No data returned after insert.');
        alert('Failed to save medicine. Please try again.');
        return;
      }
  
      setMedicines((prev) => [data[0], ...prev]);
    } catch (err) {
      console.error('Unexpected error saving medicine:', err.message);
      alert('Failed to save medicine. Please try again.');
    }
  
    toggleModal();
  };
  

  const deleteMedicine = async (medicine) => {
    console.log('Deleting medicine:', medicine);
    const response = await deleteMedicine(medicine.image_url, medicine.id);
    setMedicines((prev) => prev.filter((medicine) => medicine.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <GoBackButton screen={'Overview'} />
            <AddMedicineButton onPress={() => toggleModal()} />
        </View>
        <View style={styles.container}>
            <Text style={styles.title}>It´s medicine time!</Text>
            <Image source={medicationImage} style={styles.pandaImage} />
            <FlatList
                data={medicines}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MedicineListItem
                        medicine={item}
                        onEdit={() => toggleModal(item)}
                        onDelete={() => deleteMedicine(item)}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No medicines added</Text>}
            />
            <MedicineModal
                visible={isModalVisible}
                medicine={selectedMedicine}
                onClose={toggleModal}
                onSave={saveMedicine}
            />
        </View>
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#c0e8f6',
      padding: 20,
  },
  safeArea: {
      flex: 1,
      backgroundColor: '#c0e8f6',
      position: 'relative',
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginTop: 5, 
      marginRight: 15,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 40,
      marginBottom: 30,
  },
  emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#888',
      marginTop: 20,
  },
  pandaImage: {
      width: 150, 
      height: 150,
      alignSelf: 'center',
      marginBottom: 20,
  },
});



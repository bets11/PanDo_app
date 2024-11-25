import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import GoBackButton from '../components/common/goBackButton';
import MedicineModal from '../components/medics/medicineModal';
import MedicineListItem from '../components/medics/medicineListItem';
import AddMedicineButton from '../components/medics/addMedicineButton';

export default function Medics() {
  const [medicines, setMedicines] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const toggleModal = (medicine = null) => {
    setSelectedMedicine(medicine);
    setModalVisible(!isModalVisible);
  };

  const saveMedicine = (medicine) => {
    if (selectedMedicine) {
      setMedicines((prev) =>
        prev.map((item) =>
          item.id === selectedMedicine.id ? { ...item, ...medicine } : item
        )
      );
    } else {
      setMedicines((prev) => [
        ...prev,
        { ...medicine, id: Math.random().toString() },
      ]);
    }
    toggleModal();
  };

  const deleteMedicine = (id) => {
    setMedicines((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <GoBackButton screen={'Overview'}/>
          <AddMedicineButton onPress={() => toggleModal()} />
        </View>

      </SafeAreaView>
      <Text style={styles.title}>Track your Medicines here</Text>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MedicineListItem
            medicine={item}
            onEdit={() => toggleModal(item)}
            onDelete={() => deleteMedicine(item.id)}
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

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
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
});

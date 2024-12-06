import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";

export default function DatePickerField({ label, date, onDateChange, isRequired = false }) {
  const [showModal, setShowModal] = useState(false);
  const [tempDate, setTempDate] = useState(date || new Date(2000, 0, 1)); // Temporary date for picker

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    onDateChange(tempDate); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.dateInput}
      >
        <Text style={{ color: date ? "#000" : "#888" }}>
          {date ? date.toLocaleDateString("de-DE") : "TT.MM.JJJJ"}
        </Text>
      </TouchableOpacity>
      <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
        <View style={styles.modalContent}>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={new Date(1980, 0, 1)}
            maximumDate={new Date()}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  required: {
    color: "red",
  },
  dateInput: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#98ac6f", 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Platform, View, Modal, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditDatePickerField({ label, value, onChange, minimumDate, maximumDate, isRequired = false }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date()); 

  const handleConfirm = () => {
    const year = tempDate.getFullYear();
    const month = String(tempDate.getMonth() + 1).padStart(2, "0");
    const day = String(tempDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    onChange(formattedDate); 
    setShowDatePicker(false); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
        <Text style={{ color: value ? "#000" : "#888" }}>
          {value || "YYYY-MM-DD"} 
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  if (selectedDate) setTempDate(selectedDate);
                }}
                minimumDate={minimumDate || new Date(1980, 0, 1)}
                maximumDate={maximumDate || new Date()}
              />
              <View style={styles.buttonContainer}>
                <Button title="Cancel" onPress={() => setShowDatePicker(false)} />
                <Button title="Done" onPress={handleConfirm} />
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});

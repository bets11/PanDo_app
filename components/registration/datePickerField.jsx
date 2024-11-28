import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  View,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatePickerField({
  label,
  date,
  onDateChange,
  isRequired = false,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(date || new Date(2000, 0, 1)); // Temporary date state

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempDate(selectedDate); // Update the temporary date without closing the picker
    }
    if (Platform.OS !== "ios") {
      setShowDatePicker(false); // Automatically close picker on Android
    }
  };

  const handleConfirm = () => {
    setShowDatePicker(false); // Close the picker
    onDateChange(tempDate); // Confirm the selected date
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text style={{ color: date ? "#000" : "#888" }}>
          {date ? date.toLocaleDateString("de-DE") : "TT.MM.JJJJ"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <View>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date(1980, 0, 1)}
            maximumDate={new Date()}
          />
          {/* Confirm Button for iOS */}
          {Platform.OS === "ios" && (
            <View style={styles.confirmButtonContainer}>
              <Button title="Confirm" onPress={handleConfirm} />
            </View>
          )}
        </View>
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
  confirmButtonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});

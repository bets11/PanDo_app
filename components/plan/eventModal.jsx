import React, { useState, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Modal,Alert,} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../../lib/supabase";

const eventColors = {
  Therapy: "#C1E1DC",
  Medicine: "#FFCCAC",
  Sports: "#FDD475",
};

export default function EventModal({ visible, onClose, event, onUpdate }) {
  const [updatedEvent, setUpdatedEvent] = useState({
    ...event,
    date: event?.start?.dateTime?.slice(0, 10) || "",
    startHour: event?.start?.dateTime?.slice(11, 13) || "",
    startMinute: event?.start?.dateTime?.slice(14, 16) || "",
    endHour: event?.end?.dateTime?.slice(11, 13) || "",
    endMinute: event?.end?.dateTime?.slice(14, 16) || "",
  });

  useEffect(() => {
    if (event) {
      setUpdatedEvent({
        ...event,
        date: event?.start?.dateTime?.slice(0, 10) || "",
        startHour: event?.start?.dateTime?.slice(11, 13) || "",
        startMinute: event?.start?.dateTime?.slice(14, 16) || "",
        endHour: event?.end?.dateTime?.slice(11, 13) || "",
        endMinute: event?.end?.dateTime?.slice(14, 16) || "",
      });
    }
  }, [event]);

  const validateTime = () => {
    const { startHour, startMinute, endHour, endMinute } = updatedEvent;

    const startDate = new Date();
    startDate.setHours(parseInt(startHour, 10));
    startDate.setMinutes(parseInt(startMinute, 10));

    const endDate = new Date();
    endDate.setHours(parseInt(endHour, 10));
    endDate.setMinutes(parseInt(endMinute, 10));

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      Alert.alert("Invalid time input.", "Please enter valid start and end times.");
      return false;
    }

    if (endDate <= startDate) {
      Alert.alert("Invalid time range.", "End time must be after start time.");
      return false;
    }

    const duration = (endDate - startDate) / (1000 * 60);
    if (duration < 30) {
      Alert.alert("Short duration.", "Event must be at least 30 minutes long.");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateTime()) return;

    try {
      const updatedColor = eventColors[updatedEvent.type] || updatedEvent.color;
      const startTimestamp = `${updatedEvent.date}T${updatedEvent.startHour}:${updatedEvent.startMinute}:00.00`;
      const endTimestamp = `${updatedEvent.date}T${updatedEvent.endHour}:${updatedEvent.endMinute}:00.00`;

      const { error } = await supabase
        .from("events")
        .update({
          type: updatedEvent.type,
          start_time: startTimestamp,
          end_time: endTimestamp,
          color: updatedColor,
        })
        .eq("id", updatedEvent.id);

      if (error) {
        return;
      }

      onUpdate({
        ...updatedEvent,
        start: { dateTime: startTimestamp },
        end: { dateTime: endTimestamp },
        color: updatedColor,
      });
      onClose(); 
    } catch (err) {}
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) {
        Alert.alert("Error", "Failed to delete event.");
        return;
      }

      Alert.alert("Success", "Event deleted successfully.");
      onClose(); 
    } catch {
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Edit Event</Text>

          <Text style={styles.label}>Event Type:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={updatedEvent.type}
              onValueChange={(itemValue) =>
                setUpdatedEvent((prev) => ({ ...prev, type: itemValue }))
              }
              style={styles.picker}
            >
              <Picker.Item label="Therapy" value="Therapy" />
              <Picker.Item label="Medicine" value="Medicine" />
              <Picker.Item label="Sports" value="Sports" />
            </Picker>
          </View>

          <Text style={styles.label}>Start Time:</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="HH"
              placeholderTextColor="#888"
              value={updatedEvent.startHour}
              onChangeText={(text) =>
                setUpdatedEvent((prev) => ({ ...prev, startHour: text }))
              }
              maxLength={2}
              keyboardType="numeric"
            />
            <Text style={styles.colon}>:</Text>
            <TextInput
              style={styles.input}
              placeholder="MM"
              placeholderTextColor="#888"
              value={updatedEvent.startMinute}
              onChangeText={(text) =>
                setUpdatedEvent((prev) => ({ ...prev, startMinute: text }))
              }
              maxLength={2}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>End Time:</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="HH"
              placeholderTextColor="#888"
              value={updatedEvent.endHour}
              onChangeText={(text) =>
                setUpdatedEvent((prev) => ({ ...prev, endHour: text }))
              }
              maxLength={2}
              keyboardType="numeric"
            />
            <Text style={styles.colon}>:</Text>
            <TextInput
              style={styles.input}
              placeholder="MM"
              placeholderTextColor="#888"
              value={updatedEvent.endMinute}
              onChangeText={(text) =>
                setUpdatedEvent((prev) => ({ ...prev, endMinute: text }))
              }
              maxLength={2}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Event</Text>
          </TouchableOpacity>

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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "black",
    marginBottom: 8,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
  },
  picker: {
    color: "black",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: 50,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  colon: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: "#98ac6f",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#F66257",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#888",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

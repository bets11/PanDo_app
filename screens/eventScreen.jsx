import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../lib/supabase";

const eventColors = {
  Therapy: "#9EB25D",
  Medicine: "#F1DB4B",
  Sports: "#A7C6DA",
};

export default function EventScreen({ route, navigation }) {
  const { event } = route.params;

  const [updatedEvent, setUpdatedEvent] = useState({
    ...event,
    start_time: event.start_time.slice(0, 5), // Format to HH:MM
    end_time: event.end_time.slice(0, 5), // Format to HH:MM
  });

  const handleSave = async () => {
    try {
      const updatedColor = eventColors[updatedEvent.type] || event.color;

      const { data, error } = await supabase
        .from("events")
        .update({
          type: updatedEvent.type,
          start_time: `${updatedEvent.start_time}:00+00`, // Add seconds and timezone
          end_time: `${updatedEvent.end_time}:00+00`,
          color: updatedColor,
        })
        .eq("id", updatedEvent.id);

      if (error) {
        console.error("Error updating event:", error.message);
        Alert.alert("Error", "Failed to update event.");
        return;
      }

      console.log("Event updated successfully:", data);
      Alert.alert("Success", "Event updated successfully.");

      // Pass the updated event back to the Plan screen
      navigation.navigate("Plan", { updatedEvent: { ...updatedEvent, color: updatedColor } });
    } catch (err) {
      console.error("Unexpected error during event update:", err.message);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await supabase.from("events").delete().eq("id", event.id);

      if (error) {
        console.error("Error deleting event:", error.message);
        Alert.alert("Error", "Failed to delete event.");
        return;
      }

      console.log("Event deleted successfully:", data);
      Alert.alert("Success", "Event deleted successfully.");

      // Pass the deleted event ID back to the Plan screen
      navigation.navigate("Plan", { deletedEventId: event.id });
    } catch (err) {
      console.error("Unexpected error during event deletion:", err.message);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Event</Text>

      {/* Event Type Dropdown */}
      <Text style={styles.label}>Event Type:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={updatedEvent.type}
          onValueChange={(itemValue) =>
            setUpdatedEvent((prev) => ({ ...prev, type: itemValue }))
          }
        >
          <Picker.Item label="Select Event Type" value="" />
          <Picker.Item label="Therapy" value="Therapy" />
          <Picker.Item label="Medicine" value="Medicine" />
          <Picker.Item label="Sports" value="Sports" />
        </Picker>
      </View>

      {/* Start Time Input */}
      <Text style={styles.label}>Start Time:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter start time (HH:MM)"
        value={updatedEvent.start_time}
        onChangeText={(text) =>
          setUpdatedEvent((prev) => ({ ...prev, start_time: text }))
        }
      />

      {/* End Time Input */}
      <Text style={styles.label}>End Time:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter end time (HH:MM)"
        value={updatedEvent.end_time}
        onChangeText={(text) =>
          setUpdatedEvent((prev) => ({ ...prev, end_time: text }))
        }
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Event</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
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
    backgroundColor: "#f44336",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

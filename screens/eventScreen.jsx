import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../lib/supabase";
import EditDatePickerField from "../components/editDatePickerFiled";
import GoBackButton from "../components/common/goBackButton";

const eventColors = {
  Therapy: "#9EB25D",
  Medicine: "#F1DB4B",
  Sports: "#A7C6DA",
};

export default function EventScreen({ route, navigation }) {
  const { event } = route.params;

  const [updatedEvent, setUpdatedEvent] = useState({
    ...event,
    date: event?.start?.dateTime?.slice(0, 10) || "", 
    start_time: event?.start?.dateTime?.slice(11, 16) || "", 
    end_time: event?.end?.dateTime?.slice(11, 16) || "", 
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      setUpdatedEvent((prev) => ({ ...prev, date: `${year}-${month}-${day}` }));
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedColor = eventColors[updatedEvent.type] || updatedEvent.color;

      console.log("Updated Event:", updatedEvent);
      const startTimestamp = `${updatedEvent.date}T${updatedEvent.start_time}:00.00Z`
      const endTimestamp = `${updatedEvent.date}T${updatedEvent.end_time}:00.00Z`

      console.log("Updated Start Time:", startTimestamp);
      console.log("Updated End Time:", endTimestamp);

      const { data, error } = await supabase
        .from("events")
        .update({
          type: updatedEvent.type,
          start_time: startTimestamp,
          end_time: endTimestamp,
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

      navigation.navigate("Plan", {
        updatedEvent: {
          ...updatedEvent,
          start: { dateTime: startTimestamp },
          end: { dateTime: endTimestamp },
          color: updatedColor,
        },
      });
    } catch (err) {
      console.error("Unexpected error during event update:", err.message);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

      if (error) {
        console.error("Error deleting event:", error.message);
        Alert.alert("Error", "Failed to delete event.");
        return;
      }

      console.log("Event deleted successfully:", data);
      Alert.alert("Success", "Event deleted successfully.");

      navigation.navigate("Plan", { deletedEventId: event.id });
    } catch (err) {
      console.error("Unexpected error during event deletion:", err.message);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Event</Text>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton screen={"Plan"} />
      </SafeAreaView>
      <Text style={styles.label}>Event Type:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={updatedEvent.type}
          onValueChange={(itemValue) =>
            setUpdatedEvent((prev) => ({ ...prev, type: itemValue }))
          }
        >
          <Picker.Item label="Therapy" value="Therapy" />
          <Picker.Item label="Medicine" value="Medicine" />
          <Picker.Item label="Sports" value="Sports" />
        </Picker>
      </View>

      <EditDatePickerField
        label="Date"
        value={updatedEvent.date} 
        onChange={(newDate) =>
          setUpdatedEvent((prev) => ({ ...prev, date: newDate }))
        }
        minimumDate={new Date(2020, 0, 1)} 
        maximumDate={new Date(2030, 11, 31)} 
      />

      <Text style={styles.label}>Start Time:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter start time (HH:MM)"
        value={updatedEvent.start_time}
        onChangeText={(text) =>
          setUpdatedEvent((prev) => ({ ...prev, start_time: text }))
        }
      />

      <Text style={styles.label}>End Time:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter end time (HH:MM)"
        value={updatedEvent.end_time}
        onChangeText={(text) =>
          setUpdatedEvent((prev) => ({ ...prev, end_time: text }))
        }
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
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
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    padding: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 40,
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
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#666",
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

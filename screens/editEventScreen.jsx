import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function EditEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [updatedEvent, setUpdatedEvent] = useState(event);

  const handleSave = () => {
    navigation.navigate("Plan", { updatedEvent });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Event</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Type:</Text>
        <TextInput
          style={styles.input}
          value={updatedEvent.type}
          onChangeText={(text) =>
            setUpdatedEvent({ ...updatedEvent, type: text })
          }
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Start Time:</Text>
        <TextInput
          style={styles.input}
          value={updatedEvent.time}
          onChangeText={(text) =>
            setUpdatedEvent({ ...updatedEvent, time: text })
          }
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Time:</Text>
        <TextInput
          style={styles.input}
          value={updatedEvent.endTime}
          onChangeText={(text) =>
            setUpdatedEvent({ ...updatedEvent, endTime: text })
          }
        />
      </View>
      <Button title="Save" onPress={handleSave} color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 50
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

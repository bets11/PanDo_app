import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function EventScreen({ route, navigation }) {
    const { event } = route.params; // Get the event passed from HourlyScrollList
    const [updatedEvent, setUpdatedEvent] = useState(event);
  
    const handleSave = () => {
      console.log("Updated event:", updatedEvent); // Debug
      navigation.navigate("Plan", { updatedEvent });
    };
  
    const handleDelete = () => {
      console.log("Deleted event ID:", event.id); // Debug
      navigation.navigate("Plan", { deletedEventId: event.id });
    };
  
    return (
      <View style={styles.container}>
        <Text>Event Details:</Text>
        <Text>Type: {updatedEvent.type}</Text>
        <Text>Time: {updatedEvent.time} - {updatedEvent.endTime}</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Edit Type"
          value={updatedEvent.type}
          onChangeText={(text) => setUpdatedEvent({ ...updatedEvent, type: text })}
        />
  
        <Button title="Save Changes" onPress={handleSave} />
        <Button title="Delete Event" onPress={handleDelete} color="red" />
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
    marginBottom: 20,
    textAlign: "center",
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
  },
});

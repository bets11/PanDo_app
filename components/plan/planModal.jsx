import React, { useState } from "react";
import {View,Text,Modal,TouchableOpacity,TextInput,StyleSheet,Alert,} from "react-native";

export default function PlanModal({modalVisible,closeModal,selectEvent,eventTime,setEventTime,saveEvent}) {
  const [selectedButton, setSelectedButton] = useState(null);
  const [step, setStep] = useState(1); 

  const handleSelectEvent = (event) => {
    setSelectedButton(event); 
    selectEvent(event); 
    setStepWithPresetTime(2); 
  };

  const handleSaveEvent = async () => {
    if (!selectedButton) {
      Alert.alert("Please select an event before saving.");
      return;
    }
    await saveEvent();
    setStepWithPresetTime(1);
    setSelectedButton(null);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    const nextHalfHour = getNextHalfHour();
  
    const startHour = parseInt(nextHalfHour.startHour, 10);
    const startMinute = parseInt(nextHalfHour.startMinute, 10);
  
    let endHour = startHour;
    let endMinute = startMinute + 30;
  
    if (endMinute >= 60) {
      endMinute = endMinute - 60;
      endHour = endHour + 1;
    }
  
    if (endHour >= 24) {
      endHour = 0; 
    }
  
    setEventTime({
      startHour: String(startHour).padStart(2, '0'),
      startMinute: String(startMinute).padStart(2, '0'),
      endHour: String(endHour).padStart(2, '0'),
      endMinute: String(endMinute).padStart(2, '0'),
    });
  
    resetModal();
    closeModal();
  };
  

  const resetModal = () => {
    setStep(1);
    setSelectedButton(null);
  };

  const getNextHalfHour = () => {
    const now = new Date();
    let nextHour = now.getHours();
    let nextMinute = now.getMinutes() < 30 ? '30' : '00';
  
    if (nextMinute === '00') {
      nextHour = nextHour + 1;
      if (nextHour === 24) nextHour = 0;
    }
  
    return {
      startHour: String(nextHour).padStart(2, '0'),
      startMinute: nextMinute,
      endHour: String(nextHour + (nextMinute === '00' ? 1 : 0) > 23 ? 0 : nextHour + (nextMinute === '00' ? 1 : 0)).padStart(2, '0'),
      endMinute: nextMinute === '00' ? '30' : '00',
    };
  };

  const setStepWithPresetTime = (stepNumber, validate = false) => {
    if (validate && stepNumber === 3) {
      const { startHour, startMinute, endHour, endMinute } = eventTime;
  
      const startDate = new Date();
      startDate.setHours(parseInt(startHour, 10));
      startDate.setMinutes(parseInt(startMinute, 10));
  
      const endDate = new Date();
      endDate.setHours(parseInt(endHour, 10));
      endDate.setMinutes(parseInt(endMinute, 10));
  
      const duration = (endDate - startDate) / (1000 * 60); 
  
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        Alert.alert("Invalid time input. Please provide valid times.");
        return;
      }
      

      if (endDate <= startDate) {
        Alert.alert("End time cannot be behind or equal to the start time.");
        return; 
      }
  
      if (duration < 30) {
        Alert.alert("The duration of the event must be at least 30 minutes.");
        return; 
      }
    }
  
    setStep(stepNumber); 
  };
  
  

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Plan your day!</Text>

          {step === 1 && (
            <>
              <View style={styles.eventRow}>
                <TouchableOpacity
                  style={[
                    styles.eventButton,
                    { backgroundColor: "#C1E1DC" },
                    selectedButton === "Therapy" && styles.selectedEventButton,
                  ]}
                  onPress={() => handleSelectEvent("Therapy")}
                >
                  <Text style={styles.eventText}>Therapy</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.eventRow}>
                <TouchableOpacity
                  style={[
                    styles.eventButton,
                    { backgroundColor: "#FFCCAC" },
                    selectedButton === "Medicine" && styles.selectedEventButton,
                  ]}
                  onPress={() => handleSelectEvent("Medicine")}
                >
                  <Text style={styles.eventText}>Medicine</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.eventRow}>
                <TouchableOpacity
                  style={[
                    styles.eventButton,
                    { backgroundColor: "#FDD475" },
                    selectedButton === "Sports" && styles.selectedEventButton,
                  ]}
                  onPress={() => handleSelectEvent("Sports")}
                >
                  <Text style={styles.eventText}>Sports</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.timeSelectionTitle}>Set Start Time:</Text>
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={eventTime.startHour}
                  onChangeText={(text) =>
                    setEventTime({ ...eventTime, startHour: text })
                  }
                  maxLength={2}
                  keyboardType="numeric"
                  placeholder="HH"
                />
                <Text style={styles.colon}>:</Text>
                <TextInput
                  style={styles.timeInput}
                  value={eventTime.startMinute}
                  onChangeText={(text) =>
                    setEventTime({ ...eventTime, startMinute: text })
                  }
                  maxLength={2}
                  keyboardType="numeric"
                  placeholder="MM"
                />
              </View>

              <Text style={styles.timeSelectionTitle}>Set End Time:</Text>
              <View style={styles.timeInputContainer}>
                <TextInput
                  style={styles.timeInput}
                  value={eventTime.endHour}
                  onChangeText={(text) =>
                    setEventTime({ ...eventTime, endHour: text })
                  }
                  maxLength={2}
                  keyboardType="numeric"
                  placeholder="HH"
                />
                <Text style={styles.colon}>:</Text>
                <TextInput
                  style={styles.timeInput}
                  value={eventTime.endMinute}
                  onChangeText={(text) =>
                    setEventTime({ ...eventTime, endMinute: text })
                  }
                  maxLength={2}
                  keyboardType="numeric"
                  placeholder="MM"
                />
              </View>
              <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => setStepWithPresetTime(1)}>

                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={handleCloseModal}  >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveEvent}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  eventButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedEventButton: {
    borderWidth: 2,
    borderColor: "#000",
  },
  eventText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: 50,
    textAlign: "center",
    marginHorizontal: 5,
  },
  colon: {
    fontSize: 24,
    fontWeight: "bold",
  },
  navigationButtons: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    width: "100%",
    marginTop: 20, 
  },
  navigationButton: {
    backgroundColor: "#a8bfe7",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1, 
    marginHorizontal: 5, 
  },
  navigationButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#98ac6f",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1, 
    marginHorizontal: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "#F66257",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1, 
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  confirmationText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  timeSelectionTitle:{
    fontSize: 16,
    color: "black",
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: "center", 
  },
  buttonContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    flex: 1, 
    paddingVertical: 12,
    marginHorizontal: 5, 
    borderRadius: 8,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#A0D0FF", 
  },
  closeButton: {
    backgroundColor: "#888888", 
  },
  saveButton: {
    backgroundColor: "#98ac6f", 
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

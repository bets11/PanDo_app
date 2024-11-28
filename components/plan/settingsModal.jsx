import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback} from "react-native";

export default function SettingsModal({
  visible,
  onClose,
  onSelect,
  selectedView,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedView === 1 && styles.selectedOption,
                ]}
                onPress={() => onSelect(1)}
              >
                <Text style={styles.optionText}>Day</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedView === 3 && styles.selectedOption,
                ]}
                onPress={() => onSelect(3)}
              >
                <Text style={styles.optionText}>3 Days</Text>
              </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "30%",
    marginTop: 50, // Adjust the position from the top of the screen
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedOption: {
    backgroundColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 18,
    color: "#333",
  },
});

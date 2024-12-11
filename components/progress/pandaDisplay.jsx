import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function PandaDisplay({ currentPandaColor, currentSelectedColor }) {
  return (
    <View
      style={[
        styles.progressPandaContainer,
        {
          shadowColor:
            currentSelectedColor === "col1" ? "#000" :
            currentSelectedColor === "col2" ? "blue" :
            currentSelectedColor === "col3" ? "green" :
            currentSelectedColor === "col4" ? "yellow" :
            "red",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
        },
      ]}
    >
      <Image source={currentPandaColor} style={styles.progressPanda} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressPandaContainer: {
    width: 400,
    height: 450,
    backgroundColor: "#fff",
    borderWidth: 5,
    borderColor: "#000",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  progressPanda: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

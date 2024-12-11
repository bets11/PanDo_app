import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserPoints } from "../../services/pointsService";
import { getUserUUID } from "../../services/storageService";

const colorKeys = { black: "col1", blue: "col2", green: "col3", yellow: "col4", red: "col5" };
const colorImages = {
  col1: require("../../assets/progress_col1.png"),
  col2: require("../../assets/progress_col2.png"),
  col3: require("../../assets/progress_col3.png"),
  col4: require("../../assets/progress_col4.png"),
  col5: require("../../assets/progress_col5.png"),
};
const colorCosts = {
  blue: 80,
  green: 75,
  yellow: 95,
  red: 100,
};

export default function ColorSelector({
  points,
  unlockedColors,
  setPoints,
  setUnlockedColors,
  setCurrentPandaColor,
  setCurrentSelectedColor,
  currentSelectedColor,
}) {
  const handleColorChange = async (color) => {
    const colorKey = colorKeys[color];
    const userId = await getUserUUID();

    console.log("Selected color attempt:", color, colorKey, "Current selected:", currentSelectedColor);

    if (unlockedColors.includes(colorKey)) {
      setCurrentPandaColor(colorImages[colorKey]);
      setCurrentSelectedColor(colorKey);
      await AsyncStorage.setItem(`currentPandaKey_${userId}`, colorKey);
      console.log("Color unlocked, setting currentSelectedColor to:", colorKey);
      return;
    }

    if (points >= colorCosts[color]) {
      Alert.alert(
        "Confirm Purchase",
        `This color costs ${colorCosts[color]} points. Do you want to purchase it?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: async () => {
              try {
                const newPoints = points - colorCosts[color];
                await updateUserPoints(newPoints);
                setPoints(newPoints);

                const updatedUnlockedColors = [...unlockedColors, colorKey];
                setUnlockedColors(updatedUnlockedColors);
                await AsyncStorage.setItem(`unlockedColors_${userId}`, JSON.stringify(updatedUnlockedColors));

                setCurrentPandaColor(colorImages[colorKey]);
                setCurrentSelectedColor(colorKey);
                await AsyncStorage.setItem(`currentPandaKey_${userId}`, colorKey);

                Alert.alert("Purchase Successful", `You have successfully purchased the ${color} color!`);
                console.log("Purchase successful, setting currentSelectedColor to:", colorKey);
              } catch (error) {
                console.error("Error updating points:", error.message);
                Alert.alert("Error", "Failed to update points. Please try again.");
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Oops!",
        `You need ${colorCosts[color] - points} more points to unlock this color. Keep playing games and come back later!`
      );
    }
  };

  return (
    <View style={styles.colorCirclesContainer}>
      {Object.entries(colorKeys).map(([color, colorKey]) => {
        console.log("Rendering color:", color, colorKey, "currentSelectedColor:", currentSelectedColor);
        return (
          <View key={color} style={styles.colorOption}>
            <TouchableOpacity
              style={[
                styles.colorCircle,
                { backgroundColor: color === "black" ? "#000" : color },
                currentSelectedColor === colorKey && styles.selectedColor,
              ]}
              onPress={() => handleColorChange(color)}
            />
            {!unlockedColors.includes(colorKey) && color !== "black" && (
              <Text style={styles.costText}>{colorCosts[color]} points</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  colorCirclesContainer: { flexDirection: "row", marginTop: 30, paddingHorizontal: 10 },
  colorOption: { alignItems: "center", marginHorizontal: 10 },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
  },
  selectedColor: {
    borderColor: "#00FF00",
    borderWidth: 4,
  },
  costText: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
});

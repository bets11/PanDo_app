import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animation from "../components/animation/animation";
import GoBackButton from "../components/common/goBackButton";
import { getPointsFromUser, updateUserPoints } from "../services/pointsService";
import { getUserUUID } from "../services/storageService";

export default function Progress() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentPandaColor, setCurrentPandaColor] = useState(require("../assets/progress_col1.png"));
  const [points, setPoints] = useState(0);
  const [unlockedColors, setUnlockedColors] = useState(["col1"]);


  const colorKeys = {
    black: "col1",
    blue: "col2",
    green: "col3",
    yellow: "col4",
    red: "col5",
  };

  const colorImages = {
    col1: require("../assets/progress_col1.png"),
    col2: require("../assets/progress_col2.png"),
    col3: require("../assets/progress_col3.png"),
    col4: require("../assets/progress_col4.png"),
    col5: require("../assets/progress_col5.png"),
  };

  const colorCosts = {
    black: 0,
    blue: 5,
    green: 1,
    yellow: 2,
    red: 1,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPoints = await getPointsFromUser();
        setPoints(userPoints || 0);

        const userId = await getUserUUID();

        const savedUnlockedColors = await AsyncStorage.getItem(`unlockedColors_${userId}`);
        setUnlockedColors(savedUnlockedColors ? JSON.parse(savedUnlockedColors) : ["col1"]);

        const savedKey = await AsyncStorage.getItem(`currentPandaKey_${userId}`);
        if (savedKey && colorImages[savedKey]) {
          setCurrentPandaColor(colorImages[savedKey]);
        } else {
          setCurrentPandaColor(colorImages.col1);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleAnimationEnd = () => {
    setShowAnimation(false);
  };

  const handleColorChange = async (color) => {
    const colorKey = colorKeys[color];
    const userId = await getUserUUID();

    if (color === "black" || unlockedColors.includes(colorKey)) {
      setCurrentPandaColor(colorImages[colorKey]);
      await AsyncStorage.setItem(`currentPandaKey_${userId}`, colorKey);
      return;
    }

    const cost = colorCosts[color];
    if (points >= cost) {
      Alert.alert(
        "Confirm Purchase",
        `This color costs ${cost} points. Do you want to purchase it?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: async () => {
              try {
                const newPoints = points - cost;
                await updateUserPoints(newPoints);
                setPoints(newPoints);

                const updatedUnlockedColors = [...unlockedColors, colorKey];
                setUnlockedColors(updatedUnlockedColors);
                await AsyncStorage.setItem(`unlockedColors_${userId}`, JSON.stringify(updatedUnlockedColors));

                setCurrentPandaColor(colorImages[colorKey]);
                await AsyncStorage.setItem(`currentPandaKey_${userId}`, colorKey);
              } catch (error) {
                console.error("Error updating points:", error.message);
                Alert.alert("Error", "Failed to update points. Please try again.");
              }
            },
          },
        ]
      );
    } else {
      Alert.alert("Oops!", `You need ${cost - points} more points to unlock this color. Keep playing and come back later!`);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton screen={"Overview"} />
        <View style={styles.pointsContainer}>
          <Image source={require("../assets/star.png")} style={styles.starIcon} />
          <Text style={styles.pointsText}>{points}</Text>
        </View>
      </SafeAreaView>
      <Text style={styles.headerText}>
        Let’s give your Panda{"\n"}a new look!
      </Text>
      <View style={styles.progressPandaContainer}>
        <Image source={currentPandaColor} style={styles.progressPanda} />
      </View>
      <View style={styles.colorCirclesContainer}>
        {Object.entries(colorCosts).map(([color, cost]) => {
          const colorKey = colorKeys[color];
          return (
            <View key={color} style={styles.colorOption}>
              <TouchableOpacity
                style={[
                  styles.colorCircle,
                  { backgroundColor: color === "black" ? "#333" : color },
                  unlockedColors.includes(colorKey) && styles.unlockedColor,
                ]}
                onPress={() => handleColorChange(color)}
              />
              {color !== "black" && !unlockedColors.includes(colorKey) && (
                <Text style={styles.costText}>{cost} points</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9cf9c",
  },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    padding: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 36,
    color: "#333",
  },
  pointsContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  starIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 10,
  },
  progressPanda: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  colorCirclesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 30,
    paddingHorizontal: 10,
  },
  colorOption: {
    alignItems: "center",
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  costText: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
});

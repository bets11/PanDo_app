import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoBackButton from "../components/common/goBackButton";
import { getPointsFromUser, updateUserPoints } from "../services/pointsService";
import Animation from "../components/animation/animation";

const colorImages = {
  black: require("../assets/progress_col1.png"),
  blue: require("../assets/progress_col2.png"),
  green: require("../assets/progress_col3.png"),
  yellow: require("../assets/progress_col4.png"),
  red: require("../assets/progress_col5.png"),
};

export default function Progress() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentPandaColor, setCurrentPandaColor] = useState(require("../assets/progress_col1.png"));
  const [points, setPoints] = useState(0);
  const [unlockedColors, setUnlockedColors] = useState([]);

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

        const savedUnlockedColors = await AsyncStorage.getItem("unlockedColors");
        setUnlockedColors(savedUnlockedColors ? JSON.parse(savedUnlockedColors) : []);

        const savedKey = await AsyncStorage.getItem("currentPandaKey");
        if (savedKey && colorImages[savedKey]) {
          setCurrentPandaColor(colorImages[savedKey]);
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
    if (color === "black" || unlockedColors.includes(color)) {
      setCurrentPandaColor(colorImages[color]);
      await AsyncStorage.setItem("currentPandaKey", color);
      return;
    }

    const cost = colorCosts[color];
    if (points >= cost) {
      Alert.alert(
        "Unlock Color",
        `This color costs ${cost} points. Do you want to unlock it?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: async () => {
              try {
                const newPoints = points - cost;
                await updateUserPoints(newPoints);
                setPoints(newPoints);

                const updatedUnlockedColors = [...unlockedColors, color];
                setUnlockedColors(updatedUnlockedColors);
                await AsyncStorage.setItem("unlockedColors", JSON.stringify(updatedUnlockedColors));

                setCurrentPandaColor(colorImages[color]);
                await AsyncStorage.setItem("currentPandaKey", color);

                Alert.alert("Color Unlocked", `You have successfully unlocked the ${color} color!`);
              } catch (error) {
                console.error("Error updating points:", error.message);
                Alert.alert("Error", "Failed to unlock the color. Please try again.");
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
      {showAnimation ? (
        <View style={styles.animationContainer}>
          <Animation
            message="Great Job!"
            imageSource={require("../assets/progress.webp")}
            animationDuration={4000}
            onAnimationEnd={handleAnimationEnd}
          />
        </View>
      ) : (
        <>
          <Text style={styles.headerText}>
            Let’s give your Panda{"\n"}a new look!
          </Text>
          <View style={styles.progressPandaContainer}>
            <Image source={currentPandaColor} style={styles.progressPanda} />
          </View>
          <View style={styles.colorCirclesContainer}>
            {Object.entries(colorCosts).map(([color, cost]) => (
              <View key={color} style={styles.colorOption}>
                <TouchableOpacity
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    (unlockedColors.includes(color) || cost === 0) && styles.unlockedColor,
                  ]}
                  onPress={() => handleColorChange(color)}
                />
                {!unlockedColors.includes(color) && cost > 0 && <Text style={styles.costText}>{cost} points</Text>}
              </View>
            ))}
          </View>
        </>
      )}
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
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
  animationContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 36,
    color: "#333",
  },
  progressPandaContainer: {
    width: 400,
    height: 450,
    backgroundColor: "#ffffff",
    borderRadius: 25,
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
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  colorCirclesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%", 
    marginTop: 30,
    paddingHorizontal: 10,
  },
  colorOption: {
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  colorCircle: {
    width: 60, 
    height: 60,
    borderRadius: 30, 
    borderWidth: 2,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 7,
  },
  unlockedColor: {
    borderWidth: 4,
    borderColor: "#8FFF79", 
  },
  costText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
});

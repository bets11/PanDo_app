import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/progress/header";
import PandaDisplay from "../components/progress/pandaDisplay";
import ColorSelector from "../components/progress/codeSelector";
import Animation from "../components/animation/animation";
import { getPointsFromUser } from "../services/pointsService";
import { getUserUUID } from "../services/storageService";

const colorImages = {
  col1: require("../assets/progress_col1.png"),
  col2: require("../assets/progress_col2.png"),
  col3: require("../assets/progress_col3.png"),
  col4: require("../assets/progress_col4.png"),
  col5: require("../assets/progress_col5.png"),
};

export default function ProgressScreen({ navigation }) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentPandaColor, setCurrentPandaColor] = useState(colorImages.col1);
  const [currentSelectedColor, setCurrentSelectedColor] = useState("col1");
  const [points, setPoints] = useState(0);
  const [unlockedColors, setUnlockedColors] = useState(["col1"]);

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
          setCurrentSelectedColor(savedKey);
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

  return (
    <View style={styles.container}>
      <Header points={points} navigation={navigation} />
      {showAnimation ? (
        <Animation
        message="Great Job!"
        imageSource={require("../assets/progress.webp")}
        animationDuration={4000}
        onAnimationEnd={handleAnimationEnd}
      />
      ) : (
        <>
          <Text style={styles.headerText}>
            Let’s give your Panda{"\n"}a new look!
          </Text>
          <PandaDisplay
            currentPandaColor={currentPandaColor}
            currentSelectedColor={currentSelectedColor}
          />
          <ColorSelector
            points={points}
            unlockedColors={unlockedColors}
            setPoints={setPoints}
            setUnlockedColors={setUnlockedColors}
            setCurrentPandaColor={setCurrentPandaColor}
            setCurrentSelectedColor={setCurrentSelectedColor}
            currentSelectedColor={currentSelectedColor} 
          />
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
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 36,
    color: "#333",
  },
});

import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function ViewButtons({ onOneDayPress, onThreeDayPress }) {
  const [activeButton, setActiveButton] = useState("oneDay"); 

  const handleOneDayPress = () => {
    setActiveButton("oneDay");
    onOneDayPress(); 
  };

  const handleThreeDayPress = () => {
    setActiveButton("threeDay");
    onThreeDayPress(); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          activeButton === "oneDay" ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={handleOneDayPress}
      >
        <Image
          source={require("../../assets/oneDay.png")}
          style={[
            styles.icon,
            activeButton === "oneDay" ? styles.activeIcon : styles.inactiveIcon,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          activeButton === "threeDay" ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={handleThreeDayPress}
      >
        <Image
          source={require("../../assets/threeDay.png")}
          style={[
            styles.icon,
            activeButton === "threeDay" ? styles.activeIcon : styles.inactiveIcon,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
    marginTop: 90,
    width: 130,
    height: 50,
    bottom:20,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#63604c", 
  },
  inactiveButton: {
    backgroundColor: "#dedccf", 
  },
  icon: {
    width: 25,
    height: 25,
  },
  activeIcon: {
    tintColor: "#fff", 
  },
  inactiveIcon: {
    tintColor: "#333", 
  },
});

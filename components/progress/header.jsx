import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import GoBackButton from "../common/goBackButton";

export default function Header({ points }) {
  return (
    <View style={styles.safeArea}>
      <GoBackButton screen={"Overview"} />
      <View style={styles.pointsContainer}>
        <Image source={require("../../assets/star.png")} style={styles.starIcon} />
        <Text style={styles.pointsText}>{points}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    top: 0,
    left: -11,
    width: "100%",
    padding: 10,
    marginTop: 40,
  },
  pointsContainer: {
    position: "absolute",
    top: 20,
    right: 10,
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
});

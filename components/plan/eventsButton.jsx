import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function EventButtons({ onAddPress, onOverviewPress }) {
  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={onOverviewPress}>
        <Image source={require('../../assets/overview.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onAddPress}>
        <Image source={require('../../assets/add.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 20, // Passe dies an, um die vertikale Position zu korrigieren
    right: 10, // Platzierung rechts oben
    width: 120, // Breite, um beide Buttons sauber nebeneinander zu platzieren
  },
  iconButton: {
    marginHorizontal: 10, // Abstand zwischen den Buttons
  },
  icon: {
    width: 40, // Passe die Größe an das Bild im UI an
    height: 40,
    resizeMode: 'contain',
  },
});

import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function EventButtons({ onAddPress, onOverviewPress }) {
  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={onAddPress}>
        <Image source={require('../../assets/add.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 60,
    right: -10,
  },
  iconButton: {
    marginLeft: 15,
  },
  icon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
});
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';

export default function Header({ onProfilePress }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
          <Image source={require('../../assets/pandaProfil.png')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#BED3A6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10, 
    marginBottom: 20,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  }
});

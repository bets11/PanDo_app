import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Logo() {
  return <Image source={require('../../assets/profile_col2.png')} style={styles.logo} />;
}

const styles = StyleSheet.create({
  logo: {
    width: 125,
    height: 125,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});

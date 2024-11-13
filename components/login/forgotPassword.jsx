import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ForgotPassword() {
  return (
    <TouchableOpacity>
      <Text style={styles.text}>Forgot Password</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#0000ff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

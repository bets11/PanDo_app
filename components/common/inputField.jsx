import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function InputField({ placeholder, value, onChangeText, secureTextEntry }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType='email-address'
      autoCapitalize="none"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
  },
});

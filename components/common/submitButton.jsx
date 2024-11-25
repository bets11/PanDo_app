import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SubmitButton({ onPress, title, backgroundColor = '#000', fontColor = '#FFF' }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
      <Text style={[styles.text, { color: fontColor }]}>{title}</Text>
    </TouchableOpacity>
    
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

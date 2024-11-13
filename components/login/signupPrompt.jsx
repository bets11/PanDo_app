import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function SignupPrompt({ onPress }) {
  return (
    <Text style={styles.prompt}>
      No account?{' '}
      <Text style={styles.createText} onPress={onPress}>
        Create here!
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  prompt: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  createText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

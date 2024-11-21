import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function GoBackButton({ screen }) {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity  style={styles.backButton} onPress={() => navigation.navigate(screen)}>
      <Text style={styles.backButtonText}>Go back</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 25, 
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

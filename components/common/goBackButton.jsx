import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function GoBackButton() {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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

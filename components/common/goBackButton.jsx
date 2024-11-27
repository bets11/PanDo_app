import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function GoBackButton({ screen }) {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate(screen)}>
      <Image source={require('../../assets/goBack.png')} style={styles.backButtonImage} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginTop: 2,
  },
  backButtonImage: {
    width: 24, 
    height: 24, 
    resizeMode: 'contain', 
  },
});

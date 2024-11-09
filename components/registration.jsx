import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const navigation = useNavigation(); 

  const handleGetStarted = () => {
    navigation.navigate('Overview'); 
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/panda.png')} style={styles.pandaImage} />
      
      <TextInput style={styles.input} placeholder="First & Last Name" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Username / E-Mail" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Birthdate" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Condition" placeholderTextColor="#888" />


      <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dffcbc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pandaImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#ffff',
  },
  getStartedButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  getStartedText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

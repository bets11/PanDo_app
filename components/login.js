import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/panda.png')} style={styles.pandaImage} />
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" secureTextEntry />
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password</Text>
      </TouchableOpacity>
      <Text style={styles.noAccountText}>
        No account?{' '}
        <Text style={styles.createText} onPress={() => navigation.navigate('Register')}>
          Create here!
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotText: {
    color: '#0000ff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  noAccountText: {
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

import React from 'react';
import { StyleSheet, View, Alert, Text} from 'react-native';
import Logo from '../components/login/logo';
import InputField from '../components/common/inputField';
import SubmitButton from '../components/common/submitButton';
import ForgotPassword from '../components/login/forgotPassword';
import SignupPrompt from '../components/login/signupPrompt';
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        console.log(response.message);
        navigation.navigate('Overview'); 
      } else {
        Alert.alert('Error', response.message); 
      }
    } catch (error) {
      console.error('Unexpected error during login:', error.message);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello!</Text>
      <Text style={styles.info}>We are really happy to see you again!</Text>
      <Logo />
      <InputField placeholder="E-Mail" value={email} onChangeText={setEmail} keyboardType="email-address"/>
      <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <SubmitButton title="Login" onPress={handleLogin} backgroundColor='#000000' fontColor='#FFF' />
      <ForgotPassword />
      <SignupPrompt onPress={() => navigation.navigate('Register')} />
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
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 80, 
  },
});
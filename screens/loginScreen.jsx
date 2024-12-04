import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Logo from '../components/login/logo';
import InputField from '../components/common/inputField';
import SubmitButton from '../components/common/submitButton';
import ForgotPassword from '../components/login/forgotPassword';
import SignupPrompt from '../components/login/signupPrompt';
import { loginUser } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      showModal('Please fill in all fields.');
      return;
    }

    if (!emailRegex.test(email)) {
      showModal('Please enter a valid email address.');
      return;
    }

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        console.log(response.message);
        navigation.navigate('Overview');
      } else {
        showModal(response.message);
      }
    } catch (error) {
      console.error('Unexpected error during login:', error.message);
      showModal('Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello!</Text>
      <Text style={styles.info}>We are really happy to see you again!</Text>
      <Logo />
      <InputField placeholder="E-Mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <SubmitButton title="Login" onPress={handleLogin} backgroundColor="#000000" fontColor="#FFF" />
      <ForgotPassword />
      <SignupPrompt onPress={() => navigation.navigate('Register')} />

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

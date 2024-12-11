import React, { useState, useRef } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import GoBackButton from '../components/common/goBackButton';
import FormField from '../components/registration/formField';
import DatePickerField from '../components/registration/datePickerField';
import SubmitButton from '../components/common/submitButton';
import { registerUser } from '../services/authService';

export default function RegistrationScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [condition, setCondition] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Refs for managing focus
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const heightRef = useRef(null);
  const weightRef = useRef(null);
  const conditionRef = useRef(null);
  const birthdateRef = useRef(null);

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const handleGetStarted = async () => {
    if (!fullName || !password || !email || !birthdate) {
      showModal('Please fill in all mandatory fields');
      return;
    }
    const year = new Date(birthdate).getFullYear();
    if (year < 1900) {
      showModal('The year of birth must be 1900 or later');
      return;
    }

    try {
      const response = await registerUser(email, password, fullName, birthdate, height, weight, condition);

      if (response.success) {
        console.log(response.message);
        navigation.navigate('Overview');
      } else {
        showModal(response.message);
      }
    } catch (error) {
      console.error('Unexpected error during registration:', error.message);
      showModal('Something went wrong. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <GoBackButton screen={'Login'} />
            <Text style={styles.greeting}>Sign in</Text>
            <Text style={styles.info}>to access the playful world of PanDo!</Text>

            <View style={styles.fixedContainer}>
              <Image source={require('../assets/profile_col2.png')} style={styles.pandaImage} />
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <FormField
                label="First & Last Name"
                value={fullName}
                onChangeText={setFullName}
                isRequired
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current.focus()}
              />
              <FormField
                label="E-Mail"
                value={email}
                onChangeText={setEmail}
                isRequired
                returnKeyType="next"
                ref={emailRef}
                onSubmitEditing={() => passwordRef.current.focus()}
              />
              <FormField
                label="Password"
                value={password}
                onChangeText={setPassword}
                isRequired
                secureTextEntry
                returnKeyType="next"
                ref={passwordRef}
                onSubmitEditing={() => heightRef.current.focus()}
              />
              <DatePickerField
                label="Birthdate"
                date={birthdate}
                onDateChange={setBirthdate}
                isRequired
                ref={birthdateRef}
                onSubmitEditing={() => birthdateRef.current.focus()}
              />
              <FormField
                label="Height"
                value={height}
                onChangeText={setHeight}
                returnKeyType="next"
                ref={heightRef}
                onSubmitEditing={() => weightRef.current.focus()}
              />
              <FormField
                label="Weight"
                value={weight}
                onChangeText={setWeight}
                returnKeyType="next"
                ref={weightRef}
                onSubmitEditing={() => conditionRef.current.focus()}
              />
              <FormField
                label="Condition"
                value={condition}
                onChangeText={setCondition}
                returnKeyType="done"
                ref={conditionRef}
                onSubmitEditing={handleGetStarted}
              />
            </ScrollView>

            <View style={styles.fixedContainer}>
              <SubmitButton title="Get Started" onPress={handleGetStarted} backgroundColor="#000000" fontColor="#FFF" />
            </View>

            <Modal isVisible={isModalVisible}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>{modalMessage}</Text>
                <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#dffcbc',
  },
  fixedContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scrollView: {
    maxHeight: 550,
    width: '100%',
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
    marginLeft: 20,
  },
  greeting: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20,
  },
  pandaImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
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

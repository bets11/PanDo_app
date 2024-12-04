import React, { useState } from 'react';
import { StyleSheet, View, Image, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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



  const handleGetStarted = async () => {
    if (!fullName || !password ||!email || !birthdate) {
      Alert.alert('Error', 'Please fill in all mandatory fields');
      return;
    }
    const year = new Date(birthdate).getFullYear();
    if (year < 2000) {
      Alert.alert('Error', 'The year of birth must be 2000 or later');
      return;
    }

    try {
      const response = await registerUser(email, password, fullName, birthdate, height, weight, condition);
  
      if (response.success) {
        console.log(response.message);
        navigation.navigate('Overview'); 
      } else {
        Alert.alert('Error', response.message); 
      }
    } catch (error) {
      console.error('Unexpected error during registration:', error.message);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
        <GoBackButton screen={'Login'}/>
        <Text style={styles.greeting}>Sign in</Text>
        <Text style={styles.info}>to access the playful world of PanDo!</Text>
      <View style={styles.container}>
        

      <Image source={require('../assets/profile_col2.png')} style={styles.pandaImage} />
      
      <FormField label="First & Last Name" value={fullName} onChangeText={setFullName} isRequired />
      <FormField label="E-Mail" value={email} onChangeText={setEmail} isRequired />
      <FormField label="Password" value={password} onChangeText={setPassword} isRequired secureTextEntry />
      <DatePickerField label="Birthdate" date={birthdate} onDateChange={setBirthdate} isRequired />
      <FormField label="Height" value={height} onChangeText={setHeight} />
      <FormField label="Weight" value={weight} onChangeText={setWeight} />
      <FormField label="Condition" value={condition} onChangeText={setCondition} />
      <SubmitButton title="Get Started" onPress={handleGetStarted} backgroundColor='#000000' fontColor='#FFF' />
    </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#dffcbc',
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  safeArea: {
    alignSelf: 'flex-start',
    width: '100%',
    paddingLeft: 10,
    marginBottom: 15,
  }, 
  info: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
    marginLeft: 20,
    color: '#555',
  }, 
  greeting: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20
  }, 
  pandaImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain', 
    marginBottom: 10,
  },
});
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoBackButton from '../components/common/goBackButton';
import FormField from '../components/registration/formField';
import DatePickerField from '../components/registration/datePickerField';
import SubmitButton from '../components/common/submitButton';

export default function RegistrationScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [condition, setCondition] = useState('');


  const handleGetStarted = () => {
    if (!firstName || !username || !birthdate) {
      Alert.alert('Error', 'Please fill in all mandatory fields');
      return;
    }
    const year = new Date(birthdate).getFullYear();
    if (year < 2000) {
      Alert.alert('Error', 'The year of birth must be 2000 or later');
      return;
    }

    navigation.navigate('Overview'); 
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <GoBackButton />
        </SafeAreaView>

      <Image source={require('../assets/panda.png')} style={styles.pandaImage} />
      
      <FormField label="First & Last Name" value={firstName} onChangeText={setFirstName} isRequired />
      <FormField label="Username / E-Mail" value={username} onChangeText={setUsername} isRequired />
      <DatePickerField label="Birthdate" date={birthdate} onDateChange={setBirthdate} isRequired />
      <FormField label="Height" value={height} onChangeText={setHeight} />
      <FormField label="Weight" value={weight} onChangeText={setWeight} />
      <FormField label="Condition" value={condition} onChangeText={setCondition} />
      <SubmitButton title="Get Started" onPress={handleGetStarted} />
    </View>
    </View>
    
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
  }
});
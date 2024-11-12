import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
  const navigation = useNavigation(); 
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [condition, setCondition] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); 
    if (selectedDate) {
      setBirthdate(selectedDate); 
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go back...</Text>
          </TouchableOpacity>
        </SafeAreaView>

      <Image source={require('../assets/panda.png')} style={styles.pandaImage} />
      
      <Text style={styles.label}>First & Last Name <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Username / E-Mail <Text style={styles.required}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Birthdate <Text style={styles.required}>*</Text></Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
        <Text style={{ color: birthdate ? '#000' : '#888' }}>
          {birthdate ? birthdate.toLocaleDateString('de-DE') : 'TT.MM.JJJJ'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={birthdate || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date(1980, 0, 1)}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Height</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#888"
        value={height}
        onChangeText={setHeight}
      />
      <Text style={styles.label}>Weight</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#888"
        value={weight}
        onChangeText={setWeight}
      />
      <Text style={styles.label}>Condition</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#888"
        value={condition}
        onChangeText={setCondition}
      />

      <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>
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
  },
  backButton: {
    alignItems: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pandaImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  label: {
    width: '100%',
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  required: {
    color: 'red',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  dateInput: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
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

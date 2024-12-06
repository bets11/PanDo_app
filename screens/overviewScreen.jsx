import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/overview/header';
import ProfileModal from '../components/overview/profileModal';
import { supabase } from '../lib/supabase';
import { getUserUUID } from '../services/storageService';

export default function Overview() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [isProfileVisible, setProfileVisible] = useState(false); 

  useEffect(() => {
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    try {
      const userId = await getUserUUID();
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle();

      console.log('profile', profile);
      if (error) {
        console.error('Error fetching name:', error.message);
      } else {
        setName(profile.full_name || 'Guest');
      }
    } catch (err) {
      console.error('Unexpected error fetching name:', err.message);
    }
  };

  const Button = ({ image, label, onPress, color }) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image source={image} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.buttonLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity style={styles.headerIcon} onPress={() => setProfileVisible(true)}>
          <Image source={require('../assets/pandaProfil.png')} style={styles.profileIcon} />
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.nameBox}>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.name}>{name}!</Text>
        </View>
      <View style={styles.gridContainer}>
        <Button
          image={require('../assets/todo.webp')}
          label="To-Do-Planner"
          onPress={() => navigation.navigate('Plan')}
          color="#FFF6BA"
        />
        <Button
          image={require('../assets/medication.webp')}
          label="Medics-Tracker"
          onPress={() => navigation.navigate('Medics')}
          color="#D6F2FD"
        />
        <Button
          image={require('../assets/games.webp')}
          label="Games/Therapy"
          onPress={() => navigation.navigate('Therapy')}
          color="#f7d9c4"
        />
        <Button
          image={require('../assets/progress.webp')}
          label="Progress"
          onPress={() => navigation.navigate('Progress')}
          color="#f9cf9c"
        />
      </View>

      <ProfileModal
        visible={isProfileVisible}
        onClose={() => setProfileVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8DBC0',
    padding: 20,
    paddingTop: 60,
  },
  nameBox:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 110, 
    marginLeft: 25,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 25,
  },
  gridContainer: {
    marginTop: 90, 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '45%',
  },
  button: {
    width: 140,
    height: 140,
    borderRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    width: 95,
    height: 95,
  },
  buttonLabel: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 8,
  },
  headerIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
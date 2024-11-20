import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/overview/header';
import GridButton from '../components/overview/gridButton';
import ProfileModal from '../components/overview/profileModal';

export default function Overview() {
  const navigation = useNavigation();
  const [isProfileVisible, setProfileVisible] = useState(false);


  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header onProfilePress={() => setProfileVisible(true)} />
      </SafeAreaView>

      <Text style={styles.title}>PANDO</Text>

      <View style={styles.gridContainer}>
        <GridButton
          image={require('../assets/todo.webp')}
          label="Weekly-Planner / To-Do"
          onPress={() => navigation.navigate('Plan')}
          style={styles.box1}
        />
        <GridButton
          image={require('../assets/medication.webp')}
          label="Medics - Tracker"
          onPress={() => navigation.navigate('Medics')}
          style={styles.box2}
        />
        <GridButton
          image={require('../assets/games.webp')}
          label="Therapy / Game"
          onPress={() => navigation.navigate('Therapy')}
          style={styles.box3}
        />
        <GridButton
          image={require('../assets/progress.webp')}
          label="Progress"
          onPress={() => navigation.navigate('Progress')}
          style={styles.box4}
        />
      </View>

      <ProfileModal visible={isProfileVisible} onClose={() => setProfileVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BED3A6',
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',  
    alignItems: 'center',
    marginTop: 100,
  },
  box1: {
    backgroundColor: '#f6fcbc',
  },
  box2: {
    backgroundColor: '#c0e8f6',
  },
  box3: {
    backgroundColor: '#f7d9c4',
  },
  box4: {
    backgroundColor: '#f9cf9c',
  },
});


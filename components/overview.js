import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';

export default function Overview() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.profileButton}>
        <Image source={require('../assets/panda.png')} style={styles.profileImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <Image source={require('../assets/setting.png')} style={styles.settingsImage} />
        </TouchableOpacity>
      </SafeAreaView>

      <Text style={styles.title}>PANDO</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={[styles.box, styles.box1]}>
          <Text style={styles.boxText}>Weekly-Planner / To-Do</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, styles.box2]}>
          <Text style={styles.boxText}>Therapy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, styles.box3]}>
          <Text style={styles.boxText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, styles.box4]}>
          <Text style={styles.boxText}>Medics-Tracker</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dffcbc',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  settingsImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 150,
    marginTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '45%',
    height: 120,
    backgroundColor: '#f6fcbc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
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
  boxText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

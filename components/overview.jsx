import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Overview() {
  const navigation = useNavigation(); 
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  const toggleProfile = () => {
    setProfileVisible(!isProfileVisible);
  };

  const toggleSettings = () => {
    setSettingsVisible(!isSettingsVisible);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.profileButton} onPress={toggleProfile}>
          <Image source={require('../assets/panda.png')} style={styles.profileImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} onPress={toggleSettings}>
          <Image source={require('../assets/setting.png')} style={styles.settingsImage} />
        </TouchableOpacity>
      </SafeAreaView>

      <Text style={styles.title}>PANDO</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={[styles.box, styles.box1]} onPress={() => navigation.navigate('Plan')}>
          <Image source={require('../assets/todo.webp')} style={styles.startButton} />
          <Text style={styles.boxText}>Weekly-Planner / To-Do</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, styles.box2]} onPress={() => navigation.navigate('Medics')}>
          <Image source={require('../assets/medication.webp')} style={styles.startButton} />
          <Text style={styles.boxText}>Medics - Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.box, styles.box3]} 
          onPress={() => navigation.navigate('Therapy')} 
        >
          <Image source={require('../assets/startButton.webp')} style={styles.startButton} />
          <Text style={styles.boxText}>Therapy / Game</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.box, styles.box4]} 
          onPress={() => navigation.navigate('Progress')} 
        >
          <Image source={require('../assets/progress.webp')} style={styles.startButton} />
          <Text style={styles.boxText}>Progress</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isProfileVisible}
        onRequestClose={toggleProfile}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileContainer}>
            <SafeAreaView style={styles.profileHeader}>
              <Image source={require('../assets/pandaProfil.png')} style={styles.profileImageLarge} />
              <Text style={styles.profileTitle}>Profile</Text>
            </SafeAreaView>
            <Text style={styles.profileText}>Frau Pilgitsch</Text>
            <Text style={styles.profileText}>pilgitsch@example.com</Text>
            <Text style={styles.profileText}>21.04.2003</Text>
            <Text style={styles.profileText}>Illness</Text>
            <Text style={styles.profileText}>Medicines List</Text>
            <TouchableOpacity style={styles.closeButton} onPress={toggleProfile}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSettingsVisible}
        onRequestClose={toggleSettings}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsContainer}>
          <Image source={require('../assets/pandaSetting.png')} style={styles.settingsImageLarge} />
            <Text style={styles.settingsTitle}>Settings</Text>
            <Text style={styles.settingsText}>Notifications</Text>
            <Text style={styles.settingsText}>Account Settings</Text>
            <Text style={styles.settingsText}>Privacy</Text>
            <Text style={styles.settingsText}>Language</Text>
            <TouchableOpacity style={styles.closeButton} onPress={toggleSettings}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'flex-end', 
    paddingBottom: 10, 
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
  profileContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%', 
    height: '100%',
    backgroundColor: '#fdfdf0',
    padding: 20,
    borderRightWidth: 1,
    borderColor: '#000',
    alignItems: 'flex-start', 
  },
  settingsContainer: {
    width: '80%', 
    height: '100%',
    backgroundColor: '#f3f3f3',
    padding: 20,
    borderLeftWidth: 1,
    borderColor: '#000',
    alignItems: 'flex-start', 
  },
  settingsImageLarge: {
    width: 150,
    height: 200,
    borderRadius: 60,
    marginTop: 50,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left', 
  },
  profileHeader:{
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left', 
  },
  settingsText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'left', 
  },
  profileText:{
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'left', 
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#dffcbc',
    alignItems: 'center',
    borderRadius: 5,
    width: 100,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#000',
  },
  profileImageLarge: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginLeft:70,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#dffcbc',
  },
  profileTitle:{
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    marginTop:50,
  },
  startButton: {
    height: 30,
    width: 30,
    position: 'absolute', 
    top: 30, 
  },
  boxText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
});


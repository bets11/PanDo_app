import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Overview() {
  const navigation = useNavigation(); 
  const [isProfileVisible, setProfileVisible] = useState(false);

  const toggleProfile = () => {
    setProfileVisible(!isProfileVisible);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.profileButton} onPress={toggleProfile}>
          <Image source={require('../assets/panda.png')} style={styles.profileImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <Image source={require('../assets/setting.png')} style={styles.settingsImage} />
        </TouchableOpacity>
      </SafeAreaView>

      <Text style={styles.title}>PANDO</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={[styles.box, styles.box1]} onPress={() => navigation.navigate('Plan')}>
          <Text style={styles.boxText}>Weekly-Planner / To-Do</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, styles.box2]} onPress={() => navigation.navigate('Medics')}>
          <Text style={styles.boxText}>Medics - Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.box, styles.box3]}>
          <Text style={styles.boxText}>Therapy / Game</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.box, styles.box4]} 
          onPress={() => navigation.navigate('Progress')} 
        >
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
              <Image source={require('../assets/panda.png')} style={styles.profileImageLarge} />
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
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    marginTop: 95,
    padding: 10,
    backgroundColor: '#dffcbc',
    alignItems: 'center',
    borderRadius: 5,
    width: 100,
    marginLeft: 100,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  profileImageLarge: {
    width: 95,
    height: 95,
    borderRadius: 60,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#dffcbc',
  },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Plan() {
  const navigation = useNavigation();
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [weekRange, setWeekRange] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayOfWeek = dayNames[currentDate.getDay()];
    const formattedDate = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    setDay(dayOfWeek);
    setDate(formattedDate);

    updateWeekRange(currentDate);
  }, []);

  const updateWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (d) => `${d.getDate()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.`;

    setWeekRange(`${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`);
  };

  const handlePreviousWeek = () => {
    const startOfCurrentWeek = new Date();
    startOfCurrentWeek.setDate(new Date().getDate() - new Date().getDay() + 1);
    startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() - 7);
    updateWeekRange(startOfCurrentWeek);
  };

  const handleNextWeek = () => {
    const startOfCurrentWeek = new Date();
    startOfCurrentWeek.setDate(new Date().getDate() - new Date().getDay() + 1);
    startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 7);
    updateWeekRange(startOfCurrentWeek);
  };

  const handleAddEvent = () => {
    alert('Add new event');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/panda.png')} style={styles.pandaImage} />

        <Text style={styles.title}>Create your plan!</Text>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.dayText}>{day}</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {Array.from({ length: 24 }, (_, i) => (
            <View key={i} style={styles.hourContainer}>
              <Text style={styles.hourText}>{String(i).padStart(2, '0')}:00</Text>
              <View style={styles.line} />
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleAddEvent}>
          <Image source={require('../assets/add.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/overview.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.weekNavigation}>
              <TouchableOpacity onPress={handlePreviousWeek}>
                <Text style={styles.weekArrow}>←</Text>
              </TouchableOpacity>
              <Text style={styles.weekText}>{weekRange}</Text>
              <TouchableOpacity onPress={handleNextWeek}>
                <Text style={styles.weekArrow}>→</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {['Mo', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <Text style={styles.dayText}>{day}</Text>
                  {index === 0 && <View style={[styles.eventBlock, { backgroundColor: '#A8D5BA' }]}><Text style={styles.hourText}>10</Text></View>}
                  {index === 1 && <View style={[styles.eventBlock, { backgroundColor: '#A3BFD9' }]}><Text style={styles.hourText}>14</Text></View>}
                  {index === 2 && <View style={[styles.eventBlock, { backgroundColor: '#98E2A0' }]}><Text style={styles.hourText}>16</Text></View>}
                </View>
              ))}
            </View>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f6fcbc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 100,
    paddingBottom: 80,
  },
  pandaImage: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
  },
  dayText: {
    fontSize: 16,
    color: '#888',
  },
  scrollView: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    height: 300,
  },
  hourContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  hourText: {
    fontSize: 16,
    width: 40,
    textAlign: 'right',
    marginRight: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000', 
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  backButtonText: {
    fontSize: 32,
  },
  iconContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 60,
    right: 20,
  },
  iconButton: {
    marginLeft: 15,
  },
  icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weekArrow: {
    fontSize: 24,
    marginHorizontal: 20,
  },
  weekText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    marginBottom: 5,
  },
  eventBlock: {
    width: 40,
    height: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

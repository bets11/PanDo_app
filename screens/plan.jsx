import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Modal, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoBackButton from '../components/common/goBackButton';
import DateDisplay from '../components/plan/dateDisplay';
import HourlyScrollList from '../components/plan/hourlyScrollList';
import EventButtons from '../components/plan/eventsButton';
import WeeklyModal from '../components/plan/weeklyModal';

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

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton onPress={goBack} />
      </SafeAreaView>

      <Image source={require('../assets/panda.png')} style={styles.pandaImage} />
      <DateDisplay date={date} day={day} />
      <HourlyScrollList />
      <EventButtons
        onAddPress={() => alert('Add new event')}
        onOverviewPress={() => setModalVisible(true)}
      />
      <WeeklyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        weekRange={weekRange}
        onPreviousWeek={() => updateWeekRange(new Date(new Date().setDate(new Date().getDate() - 7)))}
        onNextWeek={() => updateWeekRange(new Date(new Date().setDate(new Date().getDate() + 7)))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f6fcbc',
  },
  safeArea: {
    width: '100%',
    marginLeft: 20,
  },
  backButton: {
    marginBottom: 3,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 80,
  },
  pandaImage: {
    width: 65,
    height: 65,
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

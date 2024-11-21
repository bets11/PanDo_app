import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, SafeAreaView } from "react-native";
import GoBackButton from "../components/common/goBackButton";
import DateDisplay from "../components/plan/dateDisplay";
import HourlyScrollList from "../components/plan/hourlyScrollList";
import EventButtons from "../components/plan/eventsButton";
import WeeklyModal from "../components/plan/weeklyModal";
import PlanModal from "../components/plan/planModal";
import uuid from 'react-native-uuid';

export default function Plan({ navigation, route }) {
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [weekRange, setWeekRange] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventTime, setEventTime] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("Events updated:", events);
  }, [events]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const updatedEvent = route?.params?.updatedEvent;
      const deletedEventId = route?.params?.deletedEventId;
  
      if (updatedEvent) {
        console.log("Updated event:", updatedEvent); // Debug
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );
        // Clear updatedEvent after processing
        navigation.setParams({ updatedEvent: null });
      }
  
      if (deletedEventId) {
        console.log("Deleted event ID:", deletedEventId); // Debug
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== deletedEventId)
        );
        // Clear deletedEventId after processing
        navigation.setParams({ deletedEventId: null });
      }
    });
  
    return unsubscribe;
  }, [navigation, route?.params]);
  
  



  useEffect(() => {
    const currentDate = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const dayOfWeek = dayNames[currentDate.getDay()];
    const formattedDate = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    setDay(dayOfWeek);
    setDate(formattedDate);

    updateWeekRange(currentDate);
  }, []);

  const getNextHalfHour = () => {
    const now = new Date();
    let nextHour = now.getHours();
    let nextMinute = now.getMinutes() < 30 ? '30' : '00';

    if (nextMinute === '00') {
      nextHour += 1;
      if (nextHour === 24) nextHour = 0; // Handle midnight wrap-around
    }

    return {
      startHour: String(nextHour).padStart(2, '0'),
      startMinute: nextMinute,
    };
  };

  const updateWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (d) => `${d.getDate()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.`;

    setWeekRange(`${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`);
  };

  const saveEvent = () => {
    const eventColors = {
      Therapy: '#9EB25D',
      Medicine: '#F1DB4B',
      Sports: '#A7C6DA',
    };

    const startTime = `${eventTime.startHour}:${eventTime.startMinute}`;
    const endTime = `${eventTime.endHour}:${eventTime.endMinute}`;

    if (!selectedEvent || !startTime || !endTime) {
      console.error("Missing event details:", { selectedEvent, startTime, endTime });
      return;
    }

    const newEvent = {
      id: uuid.v4(),
      type: selectedEvent,
      time: startTime,
      endTime: endTime,
      color: eventColors[selectedEvent],
    };

    setEvents([...events, newEvent]);
    setPlanModalVisible(false);
  };

  const goBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    const nextHalfHour = getNextHalfHour();

    const startHour = parseInt(nextHalfHour.startHour, 10);
    const startMinute = parseInt(nextHalfHour.startMinute, 10);

    let endHour = startHour;
    let endMinute = startMinute + 30;

    if (endMinute >= 60) {
      endMinute -= 60;
      endHour += 1;
    }

    if (endHour >= 24) {
      endHour = 0; 
    }

    setEventTime({
      startHour: String(startHour).padStart(2, '0'),
      startMinute: String(startMinute).padStart(2, '0'),
      endHour: String(endHour).padStart(2, '0'),
      endMinute: String(endMinute).padStart(2, '0'),
    });
  }, []);



  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton screen={'Overview'} />
      </SafeAreaView>

      <Image source={require("../assets/panda.png")} style={styles.pandaImage} />
      <DateDisplay date={date} day={day} />
      <HourlyScrollList events={events} navigation={navigation} />
      <EventButtons onAddPress={() => setPlanModalVisible(true)} onOverviewPress={() => setModalVisible(true)} />
      <WeeklyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        weekRange={weekRange}
      />
      <PlanModal
        modalVisible={planModalVisible}
        closeModal={() => setPlanModalVisible(false)}
        selectEvent={setSelectedEvent}
        eventTime={eventTime}
        setEventTime={setEventTime}
        saveEvent={saveEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f6fcbc",
    padding: 15,
  },
  safeArea: {
    width: "100%",
    marginLeft: 20,
  },
  pandaImage: {
    width: 65,
    height: 65,
    alignSelf: "center",
    marginBottom: 20,
  },
});

import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Image, SafeAreaView } from "react-native";
import GoBackButton from "../components/common/goBackButton";
import EventButtons from "../components/plan/eventsButton";
import PlanModal from "../components/plan/planModal";
import { supabase } from "../lib/supabase";
import { getUserUUID } from "../services/storageService";
import Calendar from "../components/plan/daySelecter";
import { useFocusEffect } from "@react-navigation/native";
import SettingsModal from "../components/plan/settingsModal";
import EventModal from "../components/plan/eventModal";
import ViewButtons from "../components/plan/ViewButtons";


export default function Plan({ navigation }) {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTime, setEventTime] = useState({});
  const [selectedView, setSelectedView] = useState(1);
  const handleOneDayPress = () => setSelectedView(1);
  const handleThreeDayPress = () => setSelectedView(3);

  const fetchEvents = async () => {
    const userId = await getUserUUID();

    if (!userId) {
      console.error("User not logged in");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, type, start_time, end_time, color")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching events:", error.message);
        return;
      }

      const formattedEvents = data.map((event) => ({
        id: event.id.toString(),
        title: event.type,
        start: { dateTime: new Date(event.start_time).toISOString().replace("Z", "") },
        end: { dateTime: new Date(event.end_time).toISOString().replace("Z", "") },
        color: event.color,
      }));

      setCalendarEvents(formattedEvents);
    } catch (err) {
      console.error("Unexpected error during event fetching:", err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("callign useEffect")
      fetchEvents();
    }, [])
  );

  useEffect(() => {
    const nextHalfHour = getNextHalfHour();
    setEventTime({
      startHour: nextHalfHour.startHour,
      startMinute: nextHalfHour.startMinute,
      endHour: nextHalfHour.endHour,
      endMinute: nextHalfHour.endMinute,
    });
  }, []);

  const saveEvent = async () => {
    const eventColors = {
      Therapy: "#C1E1DC",
      Medicine: "#FFCCAC",
      Sports: "#FDD475",
    };

    if (!selectedEvent || !eventTime.startHour || !eventTime.endHour) {
      console.error("Missing event details:", { selectedEvent, eventTime });
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const eventDate = `${year}-${month}-${day}`;

    const newEvent = {
      type: selectedEvent,
      start_time: `${eventDate}T${eventTime.startHour}:${eventTime.startMinute}:00`,
      end_time: `${eventDate}T${eventTime.endHour}:${eventTime.endMinute}:00`,
      color: eventColors[selectedEvent],
      user_id: await getUserUUID(),
    };

    try {
      const { data, error } = await supabase.from("events").insert([newEvent]).select();

      if (error) {
        console.error("Error saving event:", error.message, error.details);
        return;
      }

      const formattedEvent = {
        id: data[0]?.id.toString(),
        title: selectedEvent,
        start: { dateTime: newEvent.start_time },
        end: { dateTime: newEvent.end_time },
        color: newEvent.color,
      };

      setCalendarEvents((prevEvents) => [...prevEvents, formattedEvent]);
      setPlanModalVisible(false);
    } catch (err) {
      console.error("Unexpected error during event saving:", err.message);
    }
  };

  const getNextHalfHour = () => {
    const now = new Date();
    const nextMinute = now.getMinutes() < 30 ? 30 : 0;
    const nextHour = nextMinute === 0 ? now.getHours() + 1 : now.getHours();

    return {
      startHour: String(nextHour).padStart(2, "0"),
      startMinute: String(nextMinute).padStart(2, "0"),
      endHour: String(nextHour + (nextMinute === 0 ? 1 : 0)).padStart(2, "0"),
      endMinute: String((nextMinute + 30) % 60).padStart(2, "0"),
    };
  };

  const handleViewSelection = (view) => {
    setSelectedView(view);
    setSettingModalVisible(false);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventModalVisible(true);
  };

  const closeEventModal = () => {
    console.log("Closing event modal"); 
    fetchEvents();
    setSelectedEvent(null);
    setIsEventModalVisible(false);
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton screen={"Overview"} />
        <EventButtons
        onAddPress={() => setPlanModalVisible(true)}
      />
      </SafeAreaView>
      <ViewButtons
        onOneDayPress={handleOneDayPress}
        onThreeDayPress={handleThreeDayPress}
      />
      <Calendar
        style={styles.header}
        setSelectedDate={setSelectedDate}
        events={calendarEvents}
        view={selectedView}
        onEventClick={handleEventClick}
      >
        {selectedDate.toDateString()}
      </Calendar>
      <PlanModal
        modalVisible={planModalVisible}
        closeModal={() => {
          setPlanModalVisible(false);
          fetchEvents(); 
        }}
        selectEvent={setSelectedEvent}
        eventTime={eventTime}
        setEventTime={setEventTime}
        saveEvent={saveEvent}
        selectedDate={selectedDate}
      />
      <SettingsModal
        visible={settingModalVisible}
        onClose={() => setSettingModalVisible(false)}
        onSelect={handleViewSelection}
        selectedView={selectedView}
      />
      <EventModal
        visible={isEventModalVisible}
        onClose={closeEventModal}
        event={selectedEvent}
        onUpdate={(updatedEvent) => {
          console.log("Updated event:", updatedEvent);
          const updatedEvents = calendarEvents.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          );
          setCalendarEvents(updatedEvents);
        }}
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
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});

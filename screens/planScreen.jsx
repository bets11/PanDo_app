import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Image, SafeAreaView, Settings } from "react-native";
import GoBackButton from "../components/common/goBackButton";
import EventButtons from "../components/plan/eventsButton";
import PlanModal from "../components/plan/planModal";
import { supabase } from "../lib/supabase";
import { getUserUUID } from "../services/storageService";
import Calendar from "../components/plan/daySelecter";
import { useFocusEffect } from "@react-navigation/native";
import SettingsModal from "../components/plan/settingsModal";


export default function Plan({ navigation, route }) {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventTime, setEventTime] = useState({});
  const [selectedView, setSelectedView] = useState(1);


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
  
      console.log("Fetched events:", data);
  
      const formattedEvents = data.map((event) => {
        const startUTC = new Date(event.start_time).toISOString().split(".")[0] + "Z";
        const endUTC = new Date(event.end_time).toISOString().split(".")[0] + "Z";
  
        console.log("Start UTC:", startUTC);
        console.log("End UTC:", endUTC);
  
        return {
          id: event.id.toString(),
          title: event.type,
          start: { dateTime: startUTC },
          end: { dateTime: endUTC },
          color: event.color,
        };
      });
  
      console.log("Formatted events:", formattedEvents);
      setCalendarEvents(formattedEvents);
    } catch (err) {
      console.error("Unexpected error during event fetching:", err.message);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      console.log("Calendar Events:", calendarEvents);
    }, [])
  );

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
      startHour: String(startHour).padStart(2, "0"),
      startMinute: String(startMinute).padStart(2, "0"),
      endHour: String(endHour).padStart(2, "0"),
      endMinute: String(endMinute).padStart(2, "0"),
    });
  }, []);

  const saveEvent = async () => {
    const eventColors = {
      Therapy: "#9EB25D",
      Medicine: "#F1DB4B",
      Sports: "#A7C6DA",
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
      start_time: `${eventDate}T${eventTime.startHour}:${eventTime.startMinute}:00Z`, 
      end_time: `${eventDate}T${eventTime.endHour}:${eventTime.endMinute}:00Z`, 
      color: eventColors[selectedEvent],
      user_id: await getUserUUID(),
    };
  
    try {
      const { data, error } = await supabase
        .from("events")
        .insert([newEvent])
        .select();
  
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
  
      console.log("Event saved successfully:", formattedEvent);
      setCalendarEvents((prevEvents) => [...prevEvents, formattedEvent]);
      setPlanModalVisible(false);
    } catch (err) {
      console.error("Unexpected error during event saving:", err.message);
    }
  };
  
  const getNextHalfHour = () => {
    const now = new Date();
    let nextHour = now.getHours();
    let nextMinute = now.getMinutes() < 30 ? "30" : "00";

    if (nextMinute === "00") {
      nextHour += 1;
      if (nextHour === 24) nextHour = 0; 
    }

    return {
      startHour: String(nextHour).padStart(2, "0"),
      startMinute: nextMinute,
    };
  };

  const handleViewSelection = (view) => {
    setSelectedView(view);
    setSettingModalVisible(false);
  }



  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton screen={"Overview"} />
      </SafeAreaView>
      <Image
        source={require("../assets/todo.webp")}
        style={styles.pandaImage}
      />

      <Calendar style={styles.header}
        setSelectedDate={setSelectedDate}
        events={calendarEvents}
        navigation={navigation}
        view={selectedView}
      >
        {selectedDate.toDateString()}
      </Calendar>

      <EventButtons
        onAddPress={() => setPlanModalVisible(true)}
        onOverviewPress={() => setSettingModalVisible(true)}
      />
      <PlanModal
        modalVisible={planModalVisible}
        closeModal={() => setPlanModalVisible(false)}
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
  pandaImage: {
    width: 65,
    height: 65,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});

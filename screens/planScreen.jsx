import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, SafeAreaView } from "react-native";
import GoBackButton from "../components/common/goBackButton";
import EventButtons from "../components/plan/eventsButton";
import PlanModal from "../components/plan/planModal";
import { supabase } from "../lib/supabase";
import { getUserUUID } from "../services/storageService";
import Calendar from "../components/plan/daySelecter";

export default function Plan({ navigation, route }) {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventTime, setEventTime] = useState({});

  useEffect(() => {
    console.log("seletedDate", selectedDate);
    const fetchEvents = async () => {
      const session = supabase.auth.session();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User not logged in");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("user_id", userId);

        if (error) {
          console.error("Error fetching events:", error.message);
          return;
        }

        const formattedEvents = data.map((event) => ({
          id: event.id.toString(),
          title: event.type,
          start: { dateTime: event.start_time },
          end: { dateTime: event.end_time },
          color: event.color,
        }));

        setCalendarEvents(formattedEvents);
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };

    fetchEvents();
  }, []);

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
    console.log("Selected Date before saving:", selectedDate);
    console.log("Saving event:", selectedEvent, eventTime);

    const eventColors = {
      Therapy: "#9EB25D",
      Medicine: "#F1DB4B",
      Sports: "#A7C6DA",
    };

    if (!selectedEvent || !eventTime.startHour || !eventTime.endHour) {
      console.error("Missing event details:", { selectedEvent, eventTime });
      return;
    }

    const eventDate = selectedDate.toISOString().split("T")[0];

    const newEvent = {
      type: selectedEvent,
      start_time: `${eventDate}T${eventTime.startHour}:${eventTime.startMinute}:00+00`,
      end_time: `${eventDate}T${eventTime.endHour}:${eventTime.endMinute}:00+00`,
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

      // Add to CalendarContainer events format
      const formattedEvent = {
        id: data[0]?.id.toString(),
        title: selectedEvent,
        start: { dateTime: newEvent.start_time },
        end: { dateTime: newEvent.end_time },
        color: newEvent.color,
      };

      setCalendarEvents((prevEvents) => [...prevEvents, formattedEvent]); // Add to calendar events
      setPlanModalVisible(false); // Close the modal
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
      if (nextHour === 24) nextHour = 0; // Handle midnight wrap-around
    }

    return {
      startHour: String(nextHour).padStart(2, "0"),
      startMinute: nextMinute,
    };
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton screen={"Overview"} />
      </SafeAreaView>

      <Image
        source={require("../assets/panda.png")}
        style={styles.pandaImage}
      />

      {/* Header with selected date */}
      <Calendar style={styles.header} setSelectedDate={setSelectedDate} events={calendarEvents}>
        {selectedDate.toDateString()}
      </Calendar>

      <EventButtons
        onAddPress={() => setPlanModalVisible(true)}
        onOverviewPress={() => setModalVisible(true)}
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

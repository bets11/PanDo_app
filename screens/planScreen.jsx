import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, SafeAreaView } from "react-native";
import GoBackButton from "../components/common/goBackButton";
import DateDisplay from "../components/plan/dateDisplay";
import HourlyScrollList from "../components/plan/hourlyScrollList";
import EventButtons from "../components/plan/eventsButton";
import WeeklyModal from "../components/plan/weeklyModal";
import PlanModal from "../components/plan/planModal";
import { supabase } from "../lib/supabase";
import { getUserUUID } from "../services/storageService";
import { useFocusEffect } from "@react-navigation/native";

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

        setEvents(data || []);
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          console.log("Change received!", payload);
          fetchEvents(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayOfWeek = dayNames[currentDate.getDay()];
    const formattedDate = `${currentDate.getDate()} ${
      monthNames[currentDate.getMonth()]
    } ${currentDate.getFullYear()}`;

    setDay(dayOfWeek);
    setDate(formattedDate);

    updateWeekRange(currentDate);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchEvents = async () => {
        try {
          const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("start_time", { ascending: true }); // Order events by start time

          if (error) {
            console.error("Error fetching events:", error.message);
            return;
          }

          console.log("Fetched events:", data);
          setEvents(data || []);
        } catch (err) {
          console.error("Unexpected error fetching events:", err.message);
        }
      };

      fetchEvents(); 
    }, [])
  );

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

  const updateWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (d) =>
      `${d.getDate()}.${(d.getMonth() + 1).toString().padStart(2, "0")}.`;

    setWeekRange(`${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`);
  };

  const saveEvent = async () => {
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
  
    // Retrieve User UUID from AsyncStorage
    const userId = await getUserUUID();
    if (!userId) {
      console.error("User UUID not found. Ensure the user is logged in.");
      return;
    }
  
    const newEvent = {
      type: selectedEvent,
      start_time: `${eventTime.startHour}:${eventTime.startMinute}:00+00`,
      end_time: `${eventTime.endHour}:${eventTime.endMinute}:00+00`,
      color: eventColors[selectedEvent],
      user_id: userId,
    };
  
    console.log("Prepared Event Object:", newEvent);
  
    try {
      const { data, error } = await supabase.from("events").insert([newEvent]).select();
  
      if (error) {
        console.error("Error saving event to Supabase:", error.message, error.details);
        return;
      }
  
      console.log("Event saved successfully:", data);
      setEvents((prevEvents) => [...prevEvents, { ...newEvent, id: data[0]?.id }]);
      setPlanModalVisible(false); 
    } catch (err) {
      console.error("Unexpected error during event saving:", err.message);
    }
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
      startHour: String(startHour).padStart(2, "0"),
      startMinute: String(startMinute).padStart(2, "0"),
      endHour: String(endHour).padStart(2, "0"),
      endMinute: String(endMinute).padStart(2, "0"),
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        <GoBackButton screen={"Overview"} />
      </SafeAreaView>

      <Image
        source={require("../assets/panda.png")}
        style={styles.pandaImage}
      />
      <DateDisplay date={date} day={day} />
      <HourlyScrollList events={events} navigation={navigation} />
      <EventButtons
        onAddPress={() => setPlanModalVisible(true)}
        onOverviewPress={() => setModalVisible(true)}
      />
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
  },
});

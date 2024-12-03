import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
} from "@howljs/calendar-kit";
import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const customTheme = {
  colors: {
    primary: "black",
    secondary: "black",
    tertiary: "black",
    text: "black",
    background: "#f6fcbc",
  },
};

const Calendar = ({ setSelectedDate, events, view, onEventClick }) => {
  const handleScroll = (newDate) => {
    console.log("New Date:", newDate);
    const parsedDate = new Date(newDate);
    setSelectedDate(parsedDate);
  };

  const renderEvent = useCallback(
    (event) => (
      <TouchableOpacity onPress={() => onEventClick(event)}>
        <View
          style={{
            width: "100%",
            height: "100%",
            padding: 4,
            backgroundColor: event.color,
          }}
        >
          <Icon name="calendar" size={10} color="white" />
          <Text style={{ color: "white", fontSize: 10 }}>{event.title}</Text>
        </View>
      </TouchableOpacity>
    ),
    [onEventClick]
  );

  const getLocalTimezoneOffset = () => {
    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = Math.abs(offsetMinutes) / 60;
    const isAhead = offsetMinutes < 0;
    return isAhead ? `+${offsetHours}` : `-${offsetHours}`;
  };

  return (
    <CalendarContainer
      theme={customTheme}
      numberOfDays={view}
      onChange={handleScroll}
      events={events}
      timeZone={getLocalTimezoneOffset()}
    >
      <CalendarHeader />
      <CalendarBody renderEvent={renderEvent} />
    </CalendarContainer>
  );
};

export default Calendar;

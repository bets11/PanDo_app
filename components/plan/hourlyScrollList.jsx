import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function HourlyScrollList({ events, navigation }) {
  const scrollViewRef = useRef(null);
  const [currentTime, setCurrentTime] = useState("");

  const calculateTopPosition = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute; // Total minutes since 00:00
  };

  const calculateHeight = (start, end) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    return endInMinutes - startInMinutes; // Duration in minutes
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return totalMinutes; // 1px per minute
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const currentPosition = getCurrentTimePosition();
      if (scrollViewRef.current) {
        // Scroll to the current time dynamically
        scrollViewRef.current.scrollTo({
          y: Math.max(0, currentPosition - 150), // Ensure the offset isn't negative
          animated: true,
        });
      }
    }, [])
  );

  const shouldHideTimeLabel = (hour) => {
    const currentTopPosition = getCurrentTimePosition();
    const labelTopPosition = hour * 60; // Position of the hour in minutes
    const buffer = 25; // Buffer in minutes for hiding labels

    return (
      currentTopPosition >= labelTopPosition - buffer &&
      currentTopPosition <= labelTopPosition + buffer
    );
  };

  return (
    <ScrollView style={styles.scrollView} ref={scrollViewRef}>
      <View style={styles.timeGrid}>
        {Array.from({ length: 48 }, (_, i) => {
          const hour = Math.floor(i / 2);
          const isFullHour = i % 2 === 0;

          return (
            <View key={i} style={styles.timeRow}>
              {isFullHour && !shouldHideTimeLabel(hour) && (
                <Text style={styles.timeLabel}>{`${String(hour).padStart(
                  2,
                  "0"
                )}:00`}</Text>
              )}
              <View style={styles.line} />
            </View>
          );
        })}

        <View
          style={[
            styles.currentTimeLine,
            { top: getCurrentTimePosition() }, // Position dynamically
          ]}
        >
          <Text style={styles.currentTimeText}>{currentTime}</Text>
        </View>

        {events.map((event) => {
          const topPosition = calculateTopPosition(event.time);
          const height = calculateHeight(event.time, event.endTime);

          return (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventBlock,
                {
                  top: topPosition,
                  height: height,
                  backgroundColor: event.color,
                },
              ]}
              onPress={() => navigation.navigate("Event", { event })}
            >
              <Text style={styles.eventText}>{event.type}</Text>
            </TouchableOpacity>

          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    height: 600,
  },
  timeGrid: {
    position: "relative",
    height: 1440, // 24 hours * 60 minutes
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 30, // 30-minute intervals
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  timeLabel: {
    fontSize: 14,
    width: 50,
    textAlign: "right",
    marginRight: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  currentTimeLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "red",
  },
  currentTimeText: {
    position: "absolute",
    left: 10,
    top: -10,
    fontSize: 12,
    color: "red",
  },
  eventBlock: {
    position: "absolute",
    left: 60,
    right: 10,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  eventText: {
    fontSize: 14,
    color: "#000",
  },
});

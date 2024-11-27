import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function HourlyScrollList({ events, navigation }) {
  const scrollViewRef = useRef(null);
  const [currentTime, setCurrentTime] = useState("");
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const calculateTopPosition = (time) => {
    if (!time) return 0;
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };

  const calculateHeight = (start, end) => {
    if (!start || !end) return 0;
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    return Math.max(endInMinutes - startInMinutes, 0);
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`
      );
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isLayoutReady && scrollViewRef.current) {
      const currentPosition = getCurrentTimePosition();

      scrollViewRef.current.scrollTo({
        y: Math.max(currentPosition - 100, 0),
        animated: true,
      });
    }
  }, [isLayoutReady, events]);

  const handleLayout = () => setIsLayoutReady(true);

  return (
    <ScrollView
      style={styles.scrollView}
      ref={scrollViewRef}
      onLayout={handleLayout}
    >
      <View style={styles.timeGrid}>
        {Array.from({ length: 48 }, (_, i) => {
          const hour = Math.floor(i / 2);
          const isFullHour = i % 2 === 0;

          return (
            <View key={i} style={styles.timeRow}>
              {isFullHour && (
                <Text style={styles.timeLabel}>
                  {`${String(hour).padStart(2, "0")}:00`}
                </Text>
              )}
              <View style={styles.line} />
            </View>
          );
        })}

        {/* Highlight current time */}
        <View
          style={[styles.currentTimeLine, { top: getCurrentTimePosition() }]}
        >
          <Text style={styles.currentTimeText}>{currentTime}</Text>
        </View>

        {/* Render events */}
        {events.length === 0 && (
          <Text style={styles.noEventsText}>No events scheduled</Text>
        )}
        {events.map((event) => {
          const topPosition = calculateTopPosition(event.start_time);
          const height = calculateHeight(event.start_time, event.end_time);

          return (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventBlock,
                {
                  top: topPosition,
                  height: height,
                  backgroundColor: event.color || "#ccc",
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
  noEventsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

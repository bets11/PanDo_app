import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DateDisplay({ date, day }) {
  return (
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>{date}</Text>
      <Text style={styles.dayText}>{day}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

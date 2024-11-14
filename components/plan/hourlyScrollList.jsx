import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function HourlyScrollList() {
  return (
    <ScrollView style={styles.scrollView}>
      {Array.from({ length: 24 }, (_, i) => (
        <View key={i} style={styles.hourContainer}>
          <Text style={styles.hourText}>{String(i).padStart(2, '0')}:00</Text>
          <View style={styles.line} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});

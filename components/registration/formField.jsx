import React, { forwardRef } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

const FormField = forwardRef(({ label, value, onChangeText, placeholderTextColor = "#888", isRequired = false, returnKeyType, onSubmitEditing }, ref) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        returnKeyType={returnKeyType} // Support for "Next" or "Done" button
        onSubmitEditing={onSubmitEditing} // Triggered when the "Next" or "Done" button is pressed
        ref={ref} // Pass ref for focus management
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  required: {
    color: 'red',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
});

export default FormField;

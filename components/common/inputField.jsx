import React, { forwardRef } from "react";
import { TextInput, StyleSheet } from "react-native";

const InputField = forwardRef(({ placeholder, value, onChangeText, secureTextEntry, returnKeyType, onSubmitEditing }, ref) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#888"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    autoCapitalize="none"
    returnKeyType={returnKeyType}
    ref={ref}
    onSubmitEditing={onSubmitEditing}
  />
));

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 40,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: "#ffffff",
  },
});

export default InputField;

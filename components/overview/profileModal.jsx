import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, ActivityIndicator, Animated, Dimensions } from "react-native";
import { supabase } from "../../lib/supabase";
import { getUserUUID } from "../../services/storageService";

const { width } = Dimensions.get("window");

export default function ProfileModal({ visible, onClose }) {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const translateX = useState(new Animated.Value(-width))[0]; 

  useEffect(() => {
    if (visible) {
      fetchProfileData();
      Animated.timing(translateX, {
        toValue: 0, 
        duration: 600, 
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -width, 
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setProfile(null); 
      });
    }
  }, [visible]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userId = await getUserUUID();

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      } else {
        setProfile(profileData);
      }

      const { data, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user email:", userError.message);
      } else {
        setEmail(data.user.email);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateX }] }, 
          ]}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <>
              <Image
                source={require("../../assets/pandaProfil.png")}
                style={styles.profileImageLarge}
              />
              <Text style={styles.profileTitle}>Profile</Text>
              {profile ? (
                <>
                  <Text style={styles.profileText}>
                    {profile.full_name || "Name not set"}
                  </Text>
                  <Text style={styles.profileText}>
                    {email || "Email not set"}
                  </Text>
                  <Text style={styles.profileText}>
                    {profile.birthdate?.split("-").reverse().join(".")}
                  </Text>
                  <Text style={styles.profileText}>
                    {profile.illness || ""}
                  </Text>
                  <Text style={styles.profileText}>
                    {profile.medicines || ""}
                  </Text>
                </>
              ) : (
                <Text style={styles.profileText}>No profile data available</Text>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "80%", 
    backgroundColor: "#fdfdf0",
    padding: 20,
    borderRightWidth: 1,
    borderColor: "#000",
    justifyContent: "flex-start",
  },
  profileImageLarge: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: "center",
    borderWidth: 1,
    marginBottom: 20,
    borderColor: "#000",
    backgroundColor: "#dffcbc",
    marginTop: 40,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  profileText: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#dffcbc",
    alignItems: "center",
    borderRadius: 5,
    width: "40%",
    alignSelf: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#000",
  },
});
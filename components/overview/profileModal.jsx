import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { getUserUUID } from "../../services/storageService";

export default function ProfileModal({ visible, onClose }) {
  const [profile, setProfile] = useState(null); // State for profile data
  const [email, setEmail] = useState(null); // State for email
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    if (visible) {
      fetchProfileData(); // Fetch profile data when the modal is visible
    }
  }, [visible]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userId = await getUserUUID(); // Get the logged-in user's ID

      // Fetch profile data from the `profiles` table
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

      // Fetch email from the `users` table
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user email:", userError.message);
      } else {
        setEmail(data.user.email);
      }
      console.log("Fetched profile:", profileData);
      console.log("Fetched email:", data.user.email);
    } catch (err) {
      console.error("Unexpected error fetching profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
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
                    {profile.birthdate.split("-").reverse().join(".")}
                  </Text>
                  <Text style={styles.profileText}>
                    {profile.illness || ""}
                  </Text>
                  <Text style={styles.profileText}>
                    {profile.medicines || ""}
                  </Text>
                </>
              ) : (
                <Text style={styles.profileText}>
                  No profile data available
                </Text>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    height: "100%",
    backgroundColor: "#fdfdf0",
    padding: 20,
    borderRightWidth: 1,
    borderColor: "#000",
    alignItems: "left",
  },
  profileImageLarge: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginLeft: 70,
    borderWidth: 1,
    marginBottom: 20,
    borderColor: "#000",
    backgroundColor: "#dffcbc",
    marginTop: 40,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
    marginTop: 50,
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
    alignSelf: "left",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#000",
  },
});

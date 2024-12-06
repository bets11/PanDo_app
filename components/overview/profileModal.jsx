import React, { useState, useEffect } from "react";
import {View,Text,TouchableOpacity,StyleSheet,Modal,Image,ActivityIndicator,Animated,Dimensions,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import { getUserUUID } from "../../services/storageService";
import { useNavigation } from '@react-navigation/native';

const profileImages = {
  col1: require("../../assets/pandaProfil.png"), 
  col2: require("../../assets/profile_col2.png"),
  col3: require("../../assets/profile_col3.png"),
  col4: require("../../assets/profile_col4.png"),
  col5: require("../../assets/profile_col5.png"),
};

const { width } = Dimensions.get("window");

export default function ProfileModal({ visible, onClose }) {
  const [profile, setProfile] = useState(null); 
  const [email, setEmail] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImages.col1); 
  const translateX = useState(new Animated.Value(-width))[0];
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      fetchProfileData(); 
      loadProfileImage(); 
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

  const loadProfileImage = async () => {
    try {
      const savedKey = await AsyncStorage.getItem("currentPandaKey"); 
      if (savedKey && profileImages[savedKey]) {
        setCurrentProfileImage(profileImages[savedKey]); 
      } else {
        setCurrentProfileImage(profileImages.col1); 
      }
    } catch (error) {
      console.error("Error loading profile image:", error.message);
      setCurrentProfileImage(profileImages.col1); 
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onClose();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error.message);
      Alert.alert('Error', 'Failed to logout. Please try again.');
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
                source={currentProfileImage}
                style={styles.profileImageLarge}
              />
              <Text style={styles.profileTitle}>Profile</Text>

              {profile ? (
              <>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{profile.full_name || "Name not set"}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{email || "Email not set"}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Birthdate:</Text>
                  <Text style={styles.infoValue}>
                    {profile.birthdate
                      ? profile.birthdate.split("-").reverse().join(".")
                      : "Not set"}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Height:</Text>
                  <Text style={styles.infoValue}>
                    {profile.height ? `${profile.height} cm` : "Not set"}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Weight:</Text>
                  <Text style={styles.infoValue}>
                    {profile.weight ? `${profile.weight} kg` : "Not set"}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Condition:</Text>
                  <Text style={styles.infoValue}>{profile.condition || "Not set"}</Text>
                </View>
              </>
            ) : (
              <Text style={styles.profileText}>No profile data available</Text>
            )}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
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
    marginBottom: 10,
    borderColor: "#000",
    backgroundColor: "#dffcbc",
    marginTop: 55,
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
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    flex: 1,
  },
  infoValue: {
    fontSize: 18,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  logoutButton: {
    backgroundColor: '#dffcbc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginHorizontal: 20,
    width: '40%',
    top: 150,
  },
  logoutButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

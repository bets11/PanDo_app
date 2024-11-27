import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeUserUUID(userId) {
  try {
    await AsyncStorage.setItem("user_uuid", userId);
    console.log("User UUID stored successfully");
  } catch (error) {
    console.error("Failed to store User UUID:", error);
  }
}

export async function getUserUUID() {
  try {
    const userId = await AsyncStorage.getItem("user_uuid");
    if (userId !== null) {
      console.log("User UUID retrieved:", userId);
      return userId;
    } else {
      console.log("No User UUID found");
    }
  } catch (error) {
    console.error("Failed to retrieve User UUID:", error);
  }
}

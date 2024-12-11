import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function scheduleEventNotification(eventId, eventTitle, eventTime) {
  const eventDate = new Date(eventTime); 
  const notificationTime = new Date(eventDate.getTime() - 1 * 60 * 1000); 

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Upcoming Event Reminder",
      body: `You have an event: ${eventTitle} in 15 minutes.`,
    },
    trigger: notificationTime,
  });

  console.log(`Notification ${notificationId} scheduled for ${notificationTime}`);

  try {
    const storedNotifications = JSON.parse(
      (await AsyncStorage.getItem("notifications")) || "[]"
    );
    storedNotifications.push({ eventId, notificationId });
    await AsyncStorage.setItem("notifications", JSON.stringify(storedNotifications));
  } catch (error) {
    console.error("Error storing notification ID:", error);
  }
}

export async function deleteEventNotification(eventId) {
  try {
    const storedNotifications = JSON.parse(
      (await AsyncStorage.getItem("notifications")) || "[]"
    );

    const notificationIndex = storedNotifications.findIndex(
      (item) => item.eventId === eventId
    );

    if (notificationIndex !== -1) {
      const notificationId = storedNotifications[notificationIndex].notificationId;

      // Cancel the notification
      await Notifications.cancelScheduledNotificationAsync(notificationId);

      // Remove from AsyncStorage
      storedNotifications.splice(notificationIndex, 1);
      await AsyncStorage.setItem("notifications", JSON.stringify(storedNotifications));

      console.log(`Notification for event ${eventId} deleted.`);
    } else {
      console.log(`No notification found for event ${eventId}.`);
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
}

export async function getNotificationId(eventId) {
  try {
    const storedNotifications = JSON.parse(
      (await AsyncStorage.getItem("notifications")) || "[]"
    );

    const notification = storedNotifications.find(
      (item) => item.eventId === eventId
    );
    return notification ? notification.notificationId : null;
  } catch (error) {
    console.error("Error retrieving notification ID:", error);
    return null;
  }
}

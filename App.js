import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Start from './components/start';
import LoginScreen from './screens/loginScreen';
import RegistrationScreen from './screens/registrationScreen';
import OverviewScreen from './screens/overviewScreen';
import Progress from './components/progress';
import Plan from './screens/planScreen';
import MedicsScreen from './screens/medicsScreen';
import TherapyScreen from './screens/therapyScreen';
import MemoryGame from './screens/memoryGame';
import CatcherGame from './screens/catcherGame';
import QuizGame from './screens/quizGame';
import ShooterGame from './screens/shooterGame';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';


const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    console.log('Setting up notifications');
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permission required',
            'Notifications permissions are needed to alert you about scheduled events.'
          );
        }
      }
    };

    // Set up listeners for notifications
    const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
    });

    // Request permissions on mount
    requestPermissions();

    // Cleanup listeners on unmount
    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Overview" component={OverviewScreen} />
        <Stack.Screen name="Progress" component={Progress} />
        <Stack.Screen name="Plan" component={Plan} />
        <Stack.Screen name="Medics" component={MedicsScreen} />
        <Stack.Screen name="Therapy" component={TherapyScreen} />
        <Stack.Screen name="MemoryGame" component={MemoryGame} />
        <Stack.Screen name="CatcherGame" component={CatcherGame} />
        <Stack.Screen name="QuizGame" component={QuizGame} />
        <Stack.Screen name="ShooterGame" component={ShooterGame} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

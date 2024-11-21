import React from 'react';
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
import MemoryGame from './screens/MemoryGame';
import CatcherGame from './screens/catcherGame';
import EventScreen from './screens/eventScreen';
import EditEventScreen from './screens/editEventScreen';

const Stack = createStackNavigator();

export default function App() {
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
        <Stack.Screen name="Event" component={EventScreen} />
        <Stack.Screen name="EditEvent" component={EditEventScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

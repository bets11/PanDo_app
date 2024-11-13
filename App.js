import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Start from './components/start';
import LoginScreen from './screens/loginScreen';
import RegistrationScreen from './screens/registrationScreen';
import Overview from './components/overview';
import Progress from './components/progress'; 
import Plan from './components/plan';
import Medics from './components/medics';
import Therapy from './components/therapy';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Overview" component={Overview} />
        <Stack.Screen name="Progress" component={Progress} /> 
        <Stack.Screen name="Plan" component={Plan}/>
        <Stack.Screen name="Medics" component={Medics}/>
        <Stack.Screen name="Therapy" component={Therapy}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

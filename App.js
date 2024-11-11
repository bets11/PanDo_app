import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Start from './components/start';
import Login from './components/login';
import Register from './components/registration';
import Overview from './components/overview';
import Progress from './components/progress'; 
import Plan from './components/plan';
import Medics from './components/medics';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Overview" component={Overview} />
        <Stack.Screen name="Progress" component={Progress} /> 
        <Stack.Screen name="Plan" component={Plan}/>
        <Stack.Screen name="Medics" component={Medics}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

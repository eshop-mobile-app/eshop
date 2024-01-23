import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../src/screens/Profile';

function ProfileStackNavigator() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;

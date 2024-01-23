import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Favorite from '../src/screens/Favorite';

function FavoriteStackNavigator() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Favorite"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Favorite" component={Favorite} />
    </Stack.Navigator>
  );
}

export default FavoriteStackNavigator;

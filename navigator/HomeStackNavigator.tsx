import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { useSelector } from 'react-redux';
import Home from '../src/screens/Home';
import Statistics from '../src/screens/Statistics';
import SellerDashboard from '../src/screens/SellerDashboard';
import { useGetCurrentUserQuery } from '../src/store/services/user';
import ManageCategory from '../src/screens/ManageCategory';

function HomeStackNavigator() {
  const userId = useSelector((state: any) => state.user.userId);
  const { data } = useGetCurrentUserQuery<any>(userId);

  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={
          !data?.id || data?.role === 'customer' ? Home : SellerDashboard
        }
      />
      <Stack.Screen name="SellerDashbord" component={SellerDashboard} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="ManageCategory" component={ManageCategory} />
    </Stack.Navigator>
  );
}
export default HomeStackNavigator;

import * as PropTypes from 'prop-types';

import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Platform, View } from 'react-native';
import { useSelector } from 'react-redux';
import HomeStackNavigator from './HomeStackNavigator';
import FavoriteStackNavigator from './FavoriteStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import Colors from '../src/utils/colors';
import { useGetCurrentUserQuery } from '../src/store/services/user';
import Home from '../src/screens/Home';

type RenderTabIconProps = {
  focused: boolean;
  children: React.ReactNode;
  isPaddingRequired?: boolean;
};

function RenderTabIcon(props: RenderTabIconProps) {
  const { focused, children, isPaddingRequired = false } = props;

  return (
    <View
      style={{
        backgroundColor: focused ? Colors.primaryDark : 'white',
        height: 40,
        width: 40,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: isPaddingRequired ? 2 : 0,
        paddingLeft: isPaddingRequired ? 1 : 0,
      }}>
      {children}
    </View>
  );
}

RenderTabIcon.propTypes = {
  children: PropTypes.node.isRequired,
  focused: PropTypes.bool.isRequired,
  isPaddingRequired: PropTypes.bool,
};

function BottomTabNavigator(): JSX.Element {
  const Tab = createBottomTabNavigator();
  const userId = useSelector((state: any) => state.user.userId);
  const { data } = useGetCurrentUserQuery<any>(userId);

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: Platform.OS === 'ios' ? 15 : 35,
          paddingBottom: Platform.OS === 'ios' ? 20 : 35,
          backgroundColor: 'white',
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <RenderTabIcon isPaddingRequired focused={focused}>
              {focused ? (
                <Foundation name="home" color="white" size={22} />
              ) : (
                <Octicons name="home" color={Colors.primaryDark} size={24} />
              )}
            </RenderTabIcon>
          ),
        }}
      />
      {!data?.id ? null : data?.role !== 'admin' ? (
        <Tab.Screen
          name={data?.role === 'customer' ? 'FavoriteTab' : 'Home'}
          component={data?.role === 'customer' ? FavoriteStackNavigator : Home}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <RenderTabIcon focused={focused}>
                {data?.role === 'customer' ? (
                  <Ionicons
                    name={focused ? 'heart' : 'heart-outline'}
                    color={focused ? 'white' : Colors.primaryDark}
                    size={focused ? 24 : 28}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={focused ? 'archive' : 'archive-outline'}
                    color={focused ? 'white' : Colors.primaryDark}
                    size={focused ? 22 : 29}
                  />
                )}
              </RenderTabIcon>
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <RenderTabIcon focused={focused}>
              <FontAwesome
                name={focused ? 'user' : 'user-o'}
                color={focused ? 'white' : Colors.primaryDark}
                size={22}
              />
            </RenderTabIcon>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;

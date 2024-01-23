/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import * as React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { useSelector } from 'react-redux';
import AppNavigator from './navigator/AppNavigator';
import { useGetCurrentUserQuery } from './src/store/services/user';

function App(): JSX.Element {
  const userId = useSelector((state: any) => state.user.userId);
  const { isLoading: isUserLoading, isSuccess: isUserSuccess } =
    useGetCurrentUserQuery<any>(userId);
  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    if (!isUserLoading && isUserSuccess) {
      SplashScreen.hide();
    }
  }, [isUserLoading, isUserSuccess]);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;

import * as React from 'react';
import { useEffect } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabNavigator from './BottomTabNavigator';
import Login from '../src/screens/Login';
import Signup from '../src/screens/Signup';
import ForgotPassword from '../src/screens/ForgotPassword';
import ShoppingBag from '../src/screens/ShoppingBag';
import ProductDetails from '../src/screens/ProductDetails';
import CheckoutScreen from '../src/screens/CheckoutScreen';
import OrderSuccess from '../src/screens/OrderSuccess';
import YourOrders from '../src/screens/YourOrders';
import OrderDetails from '../src/screens/OrderDetails';
import AddProduct from '../src/screens/AddProduct';
import { useGetCurrentUserQuery } from '../src/store/services/user';
import { useUpdateCartMutation } from '../src/store/services/product';
import { setUserId } from '../src/store/services/userSlice';
import { setUserCart } from '../src/store/services/cartSlice';
import ProductReviews from '../src/screens/ProductReviews';
import { UserCartModel } from '../src/store/services/types';

function AppNavigator(): JSX.Element {
  const Stack = createStackNavigator();
  const userId = useSelector((state: any) => state.user.userId);
  const { data } = useGetCurrentUserQuery<any>(userId);
  const dispatch = useDispatch();
  const [updateCart] = useUpdateCartMutation();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(
      async (currentUser: FirebaseAuthTypes.User | null) => {
        const localCartData: string | null = await AsyncStorage.getItem(
          'userCart'
        );
        const cartLocalData: UserCartModel[] | null =
          localCartData && JSON.parse(localCartData);
        dispatch(setUserId(!currentUser?.uid ? '' : currentUser?.uid));

        if (!currentUser?.uid) {
          dispatch(setUserCart(cartLocalData));
        } else if (
          cartLocalData?.length &&
          data?.id &&
          data?.role === 'customer'
        ) {
          const combinedData: UserCartModel[] = [
            ...cartLocalData,
            ...(data?.cart || []),
          ];
          const finalCombinedData: UserCartModel[] = [];
          combinedData?.forEach((item: UserCartModel) => {
            const productExists = finalCombinedData.findIndex(
              (mainData: UserCartModel | undefined) =>
                mainData?.productId === item.productId
            );
            if (productExists === -1) {
              finalCombinedData.push(item);
            } else if (
              finalCombinedData[productExists].quantity < item.quantity
            ) {
              finalCombinedData[productExists].quantity = item.quantity;
            }
          });
          await updateCart(finalCombinedData);
          dispatch(setUserCart([]));
          await AsyncStorage.removeItem('userCart');
        }
      }
    );
    return subscriber;
  }, [dispatch, data?.id, data?.cart, updateCart, data?.role]);

  return (
    <Stack.Navigator
      initialRouteName="TabNavigator"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="TabNavigator" component={BottomTabNavigator} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="ProductReviews" component={ProductReviews} />
      <Stack.Screen name="ShoppingBag" component={ShoppingBag} />
      {!userId ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      ) : (
        <>
          <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
          <Stack.Screen name="YourOrders" component={YourOrders} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="AddProduct" component={AddProduct} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;

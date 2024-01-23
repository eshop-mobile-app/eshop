import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import CustomBack from '../components/CustomBack';
import Colors from '../utils/colors';
import ShoppingBagImage from '../assets/images/shopping-bags.png';
import { useGetCurrentUserQuery } from '../store/services/user';
import GlobalStyles from '../utils/globalStyles';
import BagItem from '../components/BagItem';
import { productApi, useUpdateCartMutation } from '../store/services/product';
import CustomButton from '../components/CustomButton';
import { currencyUnit } from '../utils/constants';
import { updateCartQuantity } from '../store/functions';
import { setUserCart } from '../store/services/cartSlice';

function ShoppingBag() {
  const userId = useSelector((state: any) => state.user.userId);
  const { data: userData, isLoading: userDataLoading } =
    useGetCurrentUserQuery<any>(userId);
  const dispatch = useDispatch();
  const api: any = productApi;
  const cartDetails = useSelector((state: any) => state.cart.userCart);

  const cartData = !userData?.id ? cartDetails : userData?.cart;
  const navigation: any = useNavigation();
  const [bagQty, setBagQty] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [removeProductFromCart] = useUpdateCartMutation();
  const [bagData, setBagData] = useState<any>([]);
  const [isBagDataLoading, setIsBagDataLoading] = useState(false);
  const updateQuantity = async (id: any, quantity: any) => {
    const productIndex = cartData?.findIndex(
      (item: any) => item.productId === id
    );
    if (productIndex > -1) {
      const cartDetailsClone = JSON.parse(JSON.stringify(cartData));
      cartDetailsClone[productIndex].quantity = quantity;
      if (userData?.id) {
        await updateCartQuantity(cartDetailsClone);
      } else {
        dispatch(setUserCart(cartDetailsClone));
        await AsyncStorage.setItem(
          'userCart',
          JSON.stringify(cartDetailsClone)
        );
      }
    }
  };
  const getBagData = React.useCallback(async () => {
    setIsBagDataLoading(true);
    const productIDs = cartData?.map((item: any) => item.productId);
    const all: any = [];
    if (productIDs?.length) {
      let productQuery: any = firestore().collection('products');
      if (productIDs?.length) {
        productQuery = productQuery.where('id', 'in', productIDs);
      }
      await productQuery.get().then((res: any) => {
        res.forEach((element: any) => {
          all.push(element?.data());
        });
      });
    }
    setIsBagDataLoading(false);
    setBagData(all);
  }, [cartData]);

  useEffect(() => {
    getBagData();
  }, [getBagData]);

  useEffect(() => {
    if (cartData?.length && bagData?.length) {
      let bagProductQty = 0;
      let cartPriceTotal = 0;
      cartData?.forEach((element: any) => {
        const productData: any = bagData?.find(
          (item: any) => item.id === element.productId
        );
        bagProductQty += element.quantity;
        cartPriceTotal =
          Number(cartPriceTotal) +
          Number(element.quantity) * Number(productData?.price);
      });
      setBagQty(bagProductQty);
      setCartTotal(cartPriceTotal);
    } else {
      setBagQty(0);
      setCartTotal(0);
    }
  }, [cartData, bagData]);

  useEffect(() => {
    if (!cartDetails?.length) {
      dispatch(api.util.invalidateTags(['BagProducts']));
    }
  }, [cartDetails?.length, dispatch, api]);

  const onRemoveItemFromCart = (productId: string) => {
    Alert.alert(
      'Are you sure?',
      'Are you sure you want to delete this product?',
      [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: async () => {
            const cartDetailsClone = JSON.parse(
              JSON.stringify(cartData)
            )?.filter((item: any) => item.productId !== productId);
            if (userData?.id) {
              await removeProductFromCart(cartDetailsClone)
                .then(() => {
                  Toast.show('Product deleted successfully', 2000);
                })
                .catch((error: any) => {
                  throw error;
                });
            } else {
              dispatch(setUserCart(cartDetailsClone));
              await AsyncStorage.setItem(
                'userCart',
                JSON.stringify(cartDetailsClone)
              );
              Toast.show('Product deleted successfully', 2000);
            }
          },
        },
      ]
    );
  };

  const showLoginDialog = () => {
    Alert.alert('Login required!', 'Please login to use this feature.', [
      { text: 'Cancel' },
      {
        text: 'Login',
        onPress: () => {
          navigation.navigate('Login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <View>
            <CustomBack />
          </View>
          <Text style={styles.welcomeText}>My Bag</Text>
        </View>
        <View style={styles.bagIcon}>
          <Image style={styles.imageDimensions} source={ShoppingBagImage} />
          {bagData?.length ? (
            <Text style={styles.headerQtyText}>{bagQty}</Text>
          ) : null}
        </View>
      </View>
      {(userDataLoading || isBagDataLoading) && !bagData?.length ? (
        <View style={{ marginTop: '25%' }}>
          <ActivityIndicator color={Colors.primaryDark} size={35} />
        </View>
      ) : (
        <FlatList
          data={bagData}
          extraData={bagData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const bagProductsQty: any = cartData?.find(
              (data: any) => data.productId === item.id
            );
            return (
              <BagItem
                item={{
                  ...item,
                  bagQuantity: Number(bagProductsQty?.quantity) || 0,
                }}
                onRemoveItemFromCart={onRemoveItemFromCart}
                key={item.id}
                updateQuantity={updateQuantity}
              />
            );
          }}
          ListEmptyComponent={
            <Text style={[GlobalStyles.textCenter, styles.noProductText]}>
              No product added to bag!
            </Text>
          }
          style={{
            flexGrow: 1,
            zIndex: 200,
          }}
          contentContainerStyle={{
            paddingBottom: 20,
            padding: 16,
            paddingTop: 35,
          }}
        />
      )}
      {bagData?.length ? (
        <View style={styles.bottomContainer}>
          <View style={GlobalStyles.ph16}>
            <CustomButton
              onPress={() => {
                if (userData?.id) {
                  navigation?.navigate('CheckoutScreen');
                } else {
                  showLoginDialog();
                }
              }}>
              <View style={[GlobalStyles.rowBetween, GlobalStyles.ph16]}>
                <Text style={[styles.totalValue, styles.totalText]}>
                  {currencyUnit}
                  {cartTotal}
                </Text>
                <View style={GlobalStyles.flexRow}>
                  <Text style={styles.totalValue}>Checkout</Text>
                  <AntDesign
                    name="arrowright"
                    color="white"
                    size={22}
                    style={{ marginLeft: 6 }}
                  />
                </View>
              </View>
            </CustomButton>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: Colors.primaryBg,
    height: 140,
    width: '100%',
    padding: 20,
    borderBottomWidth: 3,
    borderBottomColor: Colors.primaryDark,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: '900',
    color: 'white',
    width: '70%',
    flexGrow: 1,
    textAlign: 'center',
    marginRight: '12%',
  },
  bagIcon: {
    height: 90,
    width: 90,
    position: 'absolute',
    bottom: -20,
    left: '44%',
    zIndex: 10,
  },
  imageDimensions: {
    height: 90,
    width: 90,
  },
  headerQtyText: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    width: '100%',
    textAlign: 'center',
  },
  noProductText: { marginTop: '50%', fontSize: 16, color: Colors.primaryDark },
  bottomContainer: {
    backgroundColor: Colors.lightBrownBg,
    paddingVertical: 16,
    borderTopWidth: 3,
    borderTopColor: Colors.primaryLight,
  },
  totalContainer: {
    paddingBottom: 10,
    paddingHorizontal: 30,
    borderBottomColor: Colors.bgOpaqueBrown,
  },
  totalText: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: 'white',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
  },
});

export default ShoppingBag;

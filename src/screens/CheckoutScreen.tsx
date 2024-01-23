import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CustomBack from '../components/CustomBack';
import Colors from '../utils/colors';
import ShoppingBagImage from '../assets/images/shopping-bags.png';
import { useGetCurrentUserQuery } from '../store/services/user';
import GlobalStyles from '../utils/globalStyles';
import { useGetUserBagProductsQuery } from '../store/services/product';
import CustomButton from '../components/CustomButton';
import CartItem from '../components/CartItem';
import { currencyUnit } from '../utils/constants';
import { usePlaceOrderMutation } from '../store/services/order';
import { generateId } from '../utils/commonFunctions';

function CheckoutScreen() {
  const userId = useSelector((state: any) => state.user.userId);
  const { data: userData } = useGetCurrentUserQuery<any>(userId);
  const { data: bagData, isLoading: isBagDataLoading } =
    useGetUserBagProductsQuery<any>(userData?.cart);
  const [bagQty, setBagQty] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [placeOrder, { data: placedData, isLoading, isSuccess, isError }] =
    usePlaceOrderMutation();
  const navigation: any = useNavigation();

  useEffect(() => {
    if (isError) {
      Alert.alert("Something wen't wrong! Please try again later.");
    }
  }, [isError]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      navigation.reset({
        index: 1,
        routes: [
          {
            name: 'TabNavigator',
            state: {
              routes: [
                {
                  name: 'HomeTab',
                  state: {
                    routes: [{ name: 'Home' }],
                  },
                },
              ],
            },
          },
          {
            name: 'OrderSuccess',
            params: { orderData: placedData },
          },
        ],
      });
    }
  }, [isLoading, isSuccess, navigation, placedData]);

  useEffect(() => {
    if (userData?.cart?.length && bagData?.length) {
      let bagProductQty = 0;
      let cartPriceTotal = 0;
      userData?.cart?.forEach((element: any) => {
        const productData = bagData?.find(
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
  }, [userData?.cart, bagData]);

  const createProductData = () => {
    const orderProductData = userData?.cart?.map((item: any) => {
      const productDetails = bagData?.find(
        (bagItem: any) => bagItem.id === item.productId
      );
      const {
        id,
        brand,
        name,
        description,
        images,
        category,
        price,
        sellerId,
      } = productDetails;
      return {
        id,
        brand,
        name,
        description,
        images,
        category,
        price,
        sellerId,
        orderedQuantity: item.quantity,
        totalPrice: Number(item.quantity) * Number(productDetails?.price),
      };
    });
    return orderProductData;
  };

  const onPlaceOrder = async () => {
    const productData = createProductData();
    const sellerData = productData?.map((item: any) => item.sellerId);
    const productIds = productData?.map((item: any) => item.id);
    const orderData: any = {
      userId: userData?.id,
      totalPrice: cartTotal,
      totalQuantity: bagQty,
      orderNumber: generateId(10),
      orderDate: firestore.FieldValue.serverTimestamp(),
      productData,
      productIds,
      sellers: sellerData.filter(
        (value: string, index: number, array: any) =>
          array.indexOf(value) === index
      ),
    };
    await placeOrder(orderData);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <View>
            <CustomBack />
          </View>
          <Text style={styles.welcomeText}>Order Summary</Text>
        </View>
        <View style={styles.bagIcon}>
          <Image style={styles.imageDimensions} source={ShoppingBagImage} />
          <Text style={styles.headerQtyText}>{bagQty}</Text>
        </View>
      </View>
      {isBagDataLoading && !bagData?.length ? (
        <View style={{ marginTop: '25%' }}>
          <ActivityIndicator color={Colors.primaryDark} size={35} />
        </View>
      ) : (
        <FlatList
          data={bagData}
          extraData={bagData}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            const bagProductsQty = userData?.cart?.find(
              (data: any) => data.productId === item.id
            );
            const isLastItem = index === bagData?.length - 1;
            return (
              <CartItem
                isLastItem={isLastItem}
                item={{
                  ...item,
                  bagQuantity: bagProductsQty?.quantity,
                }}
                key={item.id}
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
      <View style={[GlobalStyles.rowBetween, styles.totalContainer]}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalText}>
          {currencyUnit}
          {cartTotal}
          /-
        </Text>
      </View>
      {bagData?.length ? (
        <View style={styles.bottomContainer}>
          <View style={GlobalStyles.ph16}>
            <CustomButton onPress={onPlaceOrder} buttonText="Place Order" />
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
  totalContainer: {
    paddingVertical: 16,
    backgroundColor: 'white',
    paddingBottom: 10,
    paddingHorizontal: 30,
    borderTopWidth: 3,
    borderTopColor: Colors.primaryLight,
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
  totalText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 5,
    lineHeight: 24,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
  },
});

export default CheckoutScreen;

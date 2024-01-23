import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import CustomBack from '../components/CustomBack';
import {
  useUpdateCartMutation,
  useGetProductByIdQuery,
  useUpdateFavoriteProductMutation,
  useUpdateProductMutation,
  useGetProductReviewsQuery,
} from '../store/services/product';
import GlobalStyles from '../utils/globalStyles';
import Colors from '../utils/colors';
import CustomButton from '../components/CustomButton';
import ProductImageCarousal from '../components/ProductImageCarousal';
import { currencyUnit } from '../utils/constants';
import { useGetCurrentUserQuery } from '../store/services/user';
import { setUserCart } from '../store/services/cartSlice';
import { average } from '../utils/commonFunctions';

type ProductDetailsProps = {
  route: any;
};

function ProductDetails({ route }: ProductDetailsProps): JSX.Element {
  const [quantity, setQuantity] = useState(1);
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const [isProductAvailable, setIsProductAvailable] = useState(true);
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [averageStars, setAverageStars] = useState<any>(0);

  const userId = useSelector((state: any) => state.user.userId);
  const productId = route?.params?.productId;

  const {
    data: productData,
    isLoading: productDataLoading,
    isSuccess: productDataSuccess,
  } = useGetProductByIdQuery({ productId });

  const { data: productReview, isLoading: reviewLoading } =
    useGetProductReviewsQuery<any>({ productId });

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (productReview?.length) {
      const stars = productReview.map((item: any) => item.rating);
      setAverageStars(average(stars));
    }
  }, [productReview]);

  const { data } = useGetCurrentUserQuery<any>(userId);
  const existingCartItems = useSelector((state: any) => state.cart.userCart);
  const dispatch = useDispatch();
  const [updateFavoriteProduct] = useUpdateFavoriteProductMutation();
  const [addProductToBag, { isLoading, isSuccess, isError }] =
    useUpdateCartMutation();
  const [disableProduct] = useUpdateProductMutation();

  const navigation = useNavigation<any>();
  const isFavorite = productData?.favorites?.includes(data?.id);
  const cartData = data?.id ? data?.cart : existingCartItems;

  useEffect(() => {
    if (!isLoading && isSuccess) {
      Toast.show('Product added to bag', 2000);
    } else if (!isLoading && isError) {
      Toast.show('Something went wrong!', 2000);
    }
  }, [isLoading, isSuccess, isError]);

  useEffect(() => {
    const findProductInCart = cartData?.findIndex(
      (item: any) => item.productId === productData?.id
    );
    const notAvailable = productData?.availableQuantity === 0;
    setIsProductAvailable(
      !(
        notAvailable ||
        Number(quantity) + Number(cartData?.[findProductInCart]?.quantity) >
          productData?.availableQuantity
      )
    );
    setIsAddDisabled(
      notAvailable ||
        Number(quantity) +
          Number(cartData?.[findProductInCart]?.quantity || 0) >=
          Number(productData?.availableQuantity)
    );
  }, [cartData, quantity, productData]);

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onFavoriteTap = async () => {
    if (!data?.id) {
      showLoginDialog();
      return;
    }
    let favData = productData?.favorites || [];
    if (favData?.includes(data?.id)) {
      favData = favData.filter((favItem: string) => favItem !== data?.id);
    } else {
      favData = [...favData, data?.id];
    }
    await updateFavoriteProduct({
      id: productData?.id,
      favorites: favData,
    });
  };

  const onTextLayout = (e: any) => {
    setLengthMore(e.nativeEvent.lines.length > 3);
  };

  const editProduct = () => {
    navigation.navigate('AddProduct', { productData });
  };

  const disableSelectedProduct = () => {
    Alert.alert(
      `${productData?.isDisabled ? 'Enabling' : 'Disabling'} product`,
      `Are you sure you want to ${
        productData?.isDisabled ? 'enable' : 'disable'
      } this product? The product will no longer be available to users.`,
      [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: async () => {
            await disableProduct({
              id: productData?.id,
              isDisabled: !productData?.isDisabled,
            })
              .then(() => {
                Toast.show(
                  `Product ${
                    productData?.isDisabled ? 'enabled' : 'disabled'
                  } successfully`,
                  2000
                );
              })
              .catch((error: any) => {
                throw error;
              });
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

  const onAddToBagPress = async () => {
    const cartDataClone =
      (cartData && JSON.parse(JSON.stringify(cartData))) || [];
    const productIndexInBag = cartDataClone?.findIndex(
      (item: any) => item.productId === productData?.id
    );
    if (productIndexInBag > -1) {
      cartDataClone[productIndexInBag].quantity += quantity;
    } else {
      cartDataClone.push({ productId: productData?.id, quantity });
    }
    if (!data?.id) {
      dispatch(setUserCart(cartDataClone));
      await AsyncStorage.setItem('userCart', JSON.stringify(cartDataClone));
      Toast.show('Product added to bag', 2000);
    } else {
      await addProductToBag(cartDataClone);
    }
  };

  return !productDataLoading && productDataSuccess && !reviewLoading ? (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.carousalContainer}>
        <ProductImageCarousal data={productData?.images} />
      </View>
      <View style={[styles.backContainer, { top: insets.top + 16 }]}>
        <CustomBack />
      </View>

      <ScrollView
        contentContainerStyle={styles.infoContainer}
        keyboardShouldPersistTaps="handled">
        <View style={[GlobalStyles.rowBetween, { alignItems: 'flex-start' }]}>
          <Text
            style={[
              styles.productName,
              data?.role === 'customer' && styles.w80,
            ]}>
            {productData?.name}
          </Text>
          {!data?.role || data?.role === 'customer' ? (
            <TouchableOpacity
              style={styles.heartContainer}
              onPress={onFavoriteTap}>
              <Ionicons
                style={GlobalStyles.textCenter}
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={30}
                color={isFavorite ? Colors.red : Colors.primaryDark}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View
          style={[
            GlobalStyles.flexRow,
            { justifyContent: 'flex-start' },
            styles.mv20,
          ]}>
          <FontAwesome
            name={averageStars ? 'star' : 'star-o'}
            color="#F8B84E"
            size={20}
            style={styles.reviewIcon}
          />
          {averageStars ? (
            <Text style={styles.starCount}>{averageStars}</Text>
          ) : null}
          <Text style={styles.divider}>|</Text>
          <TouchableOpacity
            disabled={!productReview?.length}
            onPress={() =>
              navigation.navigate('ProductReviews', {
                productId: productData?.id,
              })
            }>
            <Text
              style={{
                fontSize: 15,
                fontWeight: productReview?.length ? '600' : '400',
                color: productReview?.length ? Colors.primaryDark : 'black',
                textDecorationLine: productReview?.length
                  ? 'underline'
                  : 'none',
              }}>
              {productReview?.length || 'No'} review
              {!productReview?.length || productReview?.length > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
          <View>
            <Text
              onTextLayout={onTextLayout}
              numberOfLines={textShown ? undefined : 3}
              style={styles.productDescription}>
              {productData?.description}
            </Text>

            {lengthMore && !textShown ? (
              <Text onPress={toggleNumberOfLines} style={styles.seeMoreText}>
                ...see more
              </Text>
            ) : null}
            {lengthMore && textShown ? (
              <Text onPress={toggleNumberOfLines} style={styles.seeLessText}>
                see less
              </Text>
            ) : null}
          </View>
        </View>
        <View
          style={[
            GlobalStyles.rowBetween,
            { marginBottom: 50, marginTop: 30 },
          ]}>
          <Text style={styles.productName}>
            {currencyUnit}
            {productData?.price}
          </Text>
          {!data?.role || data?.role === 'customer' ? (
            <View style={GlobalStyles.flexRow}>
              <TouchableOpacity
                disabled={quantity === 1}
                style={quantity === 1 && styles.disabled}
                onPress={() => setQuantity(prevState => prevState - 1)}>
                <MaterialCommunityIcons
                  name="minus-circle-outline"
                  size={30}
                  color={Colors.primaryDark}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                disabled={isAddDisabled}
                onPress={() => setQuantity(prevState => prevState + 1)}>
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={30}
                  color={Colors.primaryDark}
                  style={isAddDisabled && styles.disabled}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
      {!data?.id || data?.role === 'customer' ? (
        <View style={styles.buttonContainer}>
          <CustomButton
            disabled={!isProductAvailable}
            onPress={onAddToBagPress}>
            <View style={[GlobalStyles.rowBetween, styles.ph10]}>
              <Text style={[styles.buttonText, styles.buttonDivider]}>
                Add to bag
              </Text>
              {productData?.price ? (
                <Text style={styles.buttonText}>
                  {currencyUnit}
                  {productData?.price * quantity}
                </Text>
              ) : null}
            </View>
          </CustomButton>
        </View>
      ) : data?.role === 'seller' ? (
        <View style={[styles.buttonContainer, GlobalStyles.rowBetween]}>
          <View style={styles.buttonsView}>
            <CustomButton
              onPress={editProduct}
              buttonText="Edit"
              buttonStyle={styles.editButton}
            />
          </View>
          <View style={styles.buttonsView}>
            <CustomButton
              onPress={disableSelectedProduct}
              buttonText={productData?.isDisabled ? 'Enable' : 'Disable'}
              buttonStyle={{
                backgroundColor: productData?.isDisabled
                  ? Colors.orange
                  : '#EA3D2F',
              }}
            />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  ) : (
    <SafeAreaView style={[{ flex: 1 }, GlobalStyles.flexRow]}>
      <ActivityIndicator color={Colors.primaryDark} size={40} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  carousalContainer: { height: '48%' },
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  seeMoreText: {
    color: Colors.primaryBg,
    textAlign: 'right',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 92,
    fontSize: 16,
    backgroundColor: 'white',
  },
  seeLessText: {
    color: Colors.primaryBg,
    textAlign: 'right',
    fontSize: 16,
    backgroundColor: 'white',
  },
  ph10: {
    paddingHorizontal: 10,
  },
  heartContainer: {
    backgroundColor: Colors.bgOpaqueBrown,
    height: 40,
    width: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  infoContainer: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
    paddingBottom: 90,
  },
  backContainer: {
    position: 'absolute',
    left: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'left',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonDivider: {
    width: '50%',
    borderRightWidth: 2,
    borderRightColor: 'white',
  },
  buttonsView: { width: '48%' },
  divider: {
    color: 'grey',
    marginHorizontal: 10,
  },
  starCount: {
    marginLeft: 8,
  },
  buttonContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 20,
    paddingTop: 16,
    left: 0,
    paddingHorizontal: 16,
    width: '100%',
  },
  editButton: { backgroundColor: '#2FA84E' },
  quantityText: {
    fontSize: 16,
    color: Colors.primaryDark,
    fontWeight: '800',
    marginHorizontal: 12,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  w80: {
    width: '85%',
  },
  productDescription: {
    fontSize: 16,
    color: 'black',
    lineHeight: 22,
  },
  mv20: {
    marginVertical: 20,
  },
  mv30: {
    marginVertical: 30,
  },
  reviewIcon: { textAlign: 'left' },
});

export default ProductDetails;

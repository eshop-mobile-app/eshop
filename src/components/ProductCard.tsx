import * as React from 'react';
import { useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import GlobalStyles from '../utils/globalStyles';
import Colors from '../utils/colors';
import { useGetCurrentUserQuery } from '../store/services/user';
import {
  useUpdateFavoriteProductMutation,
  useUpdateProductMutation,
} from '../store/services/product';
import ImageWithBlurBg from './ImageWithBlurBg';
import { currencyUnit } from '../utils/constants';

function ProductCard(props: any) {
  const userId = useSelector((state: any) => state.user.userId);
  const { data } = useGetCurrentUserQuery<any>(userId);
  const { item } = props;
  const isFavorite = item.favorites?.includes(data?.id);
  const actionSheetRef: any = useRef();
  const [disableProduct] = useUpdateProductMutation();
  const [updateFavoriteProduct] = useUpdateFavoriteProductMutation();
  const navigation: any = useNavigation();
  const productAction = [
    'Edit',
    item?.isDisabled ? 'Enable' : 'Disable',
    'Cancel',
  ];

  const disableSelectedProduct = () => {
    Alert.alert(
      `${item?.isDisabled ? 'Enabling' : 'Disabling'} product`,
      `Are you sure you want to ${
        item?.isDisabled ? 'enable' : 'disable'
      } this product? The product will no longer be available to users.`,
      [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: async () => {
            await disableProduct({
              id: item?.id,
              isDisabled: !item?.isDisabled,
            })
              .then(() => {
                Toast.show(
                  `Product ${
                    item?.isDisabled ? 'enabled' : 'disabled'
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
  const editProduct = () => {
    navigation.navigate('AddProduct', { productData: item });
  };

  const onFavoriteTap = async () => {
    let favData = item.favorites || [];
    if (favData?.includes(data?.id)) {
      favData = favData.filter((favItem: string) => favItem !== data?.id);
    } else {
      favData = [...favData, data?.id];
    }
    await updateFavoriteProduct({ id: item?.id, favorites: favData });
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
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductDetails', { productId: item?.id })
      }
      style={[
        GlobalStyles.rowBetween,
        {
          borderRadius: 20,
          overflow: 'hidden',
          width: '47%',
          marginBottom: 15,
        },
      ]}>
      <TouchableOpacity
        style={styles.heartContainer}
        onPress={async () => {
          if (!data?.id) {
            showLoginDialog();
            return;
          }
          if (data?.role === 'seller') {
            actionSheetRef.current.show();
          } else {
            await onFavoriteTap();
          }
        }}>
        {data?.role?.toLowerCase() === 'seller' ? (
          <SimpleLineIcons
            name="options"
            size={18}
            color={isFavorite ? Colors.red : Colors.primaryDark}
          />
        ) : (
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={25}
            color={isFavorite ? Colors.red : Colors.primaryDark}
          />
        )}
      </TouchableOpacity>
      {data?.role?.toLowerCase() === 'seller' ? (
        <View style={styles.visibilityContainer}>
          <Ionicons
            name={item?.isDisabled ? 'eye-off' : 'eye'}
            color={item?.isDisabled ? 'red' : 'green'}
            size={22}
          />
        </View>
      ) : null}
      <View style={{ height: 220, width: '100%' }}>
        <ImageWithBlurBg url={item?.images?.[0]} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.productNameText} numberOfLines={2}>
          {item?.name}
        </Text>
        <Text style={styles.productPriceText}>
          {currencyUnit}
          {item?.price}
        </Text>
      </View>
      <ActionSheet
        ref={actionSheetRef}
        title="Select action"
        options={productAction}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index: any) => {
          if (index === 1) {
            disableSelectedProduct();
          } else if (index === 0) {
            editProduct();
          }
        }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heartContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    position: 'absolute',
    zIndex: 200,
    top: 12,
    right: 12,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    paddingLeft: 2,
    paddingTop: 2,
  },
  visibilityContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    position: 'absolute',
    zIndex: 200,
    top: 12,
    right: 54,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    paddingLeft: 2,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginBottom: 12,
    marginHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: '85%',
    borderRadius: 12,
    padding: 8,
  },
  productNameText: {
    color: Colors.primaryDark,
    fontSize: 16,
    fontWeight: '700',
    flexGrow: 1,
    marginRight: 8,
  },
  productPriceText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '900',
    width: 'auto',
  },
});

export default ProductCard;

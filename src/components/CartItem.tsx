import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import ImageWithBlurBg from './ImageWithBlurBg';
import GlobalStyles from '../utils/globalStyles';
import Colors from '../utils/colors';
import { currencyUnit } from '../utils/constants';
import {
  useAddReviewMutation,
  useGetOrderProductReviewsQuery,
  useUpdateReviewMutation,
} from '../store/services/order';
import AddReview from './AddReview';
import RenderStars from './RenderStar';
import { useGetCurrentUserQuery } from '../store/services/user';

function CartItem(props: any): JSX.Element {
  const { item, updateQuantity, isLastItem, page, orderId } = props;
  const [quantity, setQuantity] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userId = useSelector((state: any) => state.user.userId);
  const { data: userData } = useGetCurrentUserQuery<any>(userId);
  const isOrderHistory = page === 'OrderDetails';
  const [addProductReview] = useAddReviewMutation();
  const [updateProductReview] = useUpdateReviewMutation();
  const { data: productReview } = useGetOrderProductReviewsQuery<any>(
    { orderId, productId: item?.id, userId: userData?.userId },
    { skip: !orderId || !item?.id || !userData?.userId }
  );
  useEffect(() => {
    if (item.bagQuantity) {
      setQuantity(item.bagQuantity);
    }
  }, [item.bagQuantity]);

  useEffect(() => {
    if (quantity && item?.bagQuantity && quantity !== item?.bagQuantity) {
      updateQuantity(item.id, quantity);
    }
  }, [quantity, item?.bagQuantity, item.id, updateQuantity]);

  const addReview = (starCount: number) => {
    if (productReview?.id) {
      updateProductReview({ id: productReview?.id, rating: starCount });
    } else {
      const reviewData = {
        userId: userData?.id,
        productId: item.id,
        sellerId: item.sellerId,
        orderId,
        rating: starCount,
        datePosted: firestore.FieldValue.serverTimestamp(),
      };
      console.log({ reviewData });

      addProductReview(reviewData);
    }
  };

  const onSubmitReview = async (comment: any) => {
    if (!comment()?.trim()?.length) {
      return;
    }
    await updateProductReview({ id: productReview?.id, comment });
    Toast.show('Review added sucessfully!', 2000);
    setIsModalVisible(false);
  };
  console.log('userData', userData);

  return (
    <View style={[!isLastItem && styles.cardContainer, GlobalStyles.flexRow]}>
      <View style={styles.imageContainer}>
        <ImageWithBlurBg url={item?.images?.[0]} borderRadius={12} />
      </View>
      <View style={[styles.infoContainer]}>
        <View style={styles.nameBrandContainer}>
          <Text style={styles.brandText}>{item.brand}</Text>
          <Text style={styles.nameText} numberOfLines={1}>
            {item.name}
          </Text>
          {isOrderHistory && userData?.role === 'customer' ? (
            !productReview?.id ? (
              <Text style={styles.brandText}>Rate Product</Text>
            ) : (
              <View style={{ alignItems: 'flex-start', marginLeft: -4 }}>
                <RenderStars
                  rating={productReview?.rating}
                  addReview={addReview}
                />
              </View>
            )
          ) : null}
        </View>
        <View>
          <Text style={styles.qtyText}>
            Qty:
            {item?.bagQuantity}
          </Text>
          <Text style={styles.priceText}>
            {currencyUnit}
            {Number(item.bagQuantity) * Number(item?.price)}
          </Text>
          {isOrderHistory && userData?.role === 'customer' ? (
            !productReview?.id ? (
              <RenderStars
                rating={productReview?.rating}
                addReview={addReview}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(true);
                }}>
                <Text style={styles.tellMoreText}>
                  {productReview?.comment ? 'View Review' : 'Tell more'}
                </Text>
              </TouchableOpacity>
            )
          ) : null}
        </View>
      </View>
      <AddReview
        isViewable={productReview?.comment}
        isVisible={isModalVisible}
        closeModal={() => {
          setIsModalVisible(false);
        }}
        productReview={productReview}
        submitReview={onSubmitReview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  nameText: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.primaryDark,
    maxWidth: '85%',
  },

  nameBrandContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  imageContainer: {
    height: 70,
    width: '20%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.logoBg,
    paddingBottom: 16,
  },
  infoContainer: {
    marginLeft: 10,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'grey',
    maxWidth: '83%',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryDark,
    textAlign: 'right',
  },
  qtyText: {
    textAlign: 'right',
    color: 'grey',
    marginBottom: 2,
    fontWeight: '500',
  },
  tellMoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryBg,
    textDecorationLine: 'underline',
  },
});

export default CartItem;

import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../utils/globalStyles';
import Colors from '../utils/colors';
import ImageWithBlurBg from './ImageWithBlurBg';
import { currencyUnit } from '../utils/constants';
import { formatSecondsToDate } from '../utils/commonFunctions';

function OrderHistoryCard(props: any) {
  const { item } = props;
  const [isItemExpanded, setIsItemExpanded] = useState(false);

  const navigation: any = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={GlobalStyles.rowBetween}>
        <Text style={styles.dateText}>
          {formatSecondsToDate(item.orderDate?.seconds)}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('OrderDetails', { orderData: item })
          }>
          <Text style={styles.detailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
      <View style={[GlobalStyles.rowBetween, styles.orderHeaderContainer]}>
        <Text style={styles.orderNumberText}>#{item?.orderNumber}</Text>
        <TouchableOpacity
          style={GlobalStyles.flexRow}
          onPress={() => setIsItemExpanded((prevState: boolean) => !prevState)}>
          <MaterialIcons
            name={isItemExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={30}
            color={Colors.primaryDark}
          />
        </TouchableOpacity>
      </View>
      {isItemExpanded
        ? item?.productData?.map((product: any, index: number) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  productId: product?.id,
                })
              }
              key={product?.id + item.id}
              style={[
                GlobalStyles.flexRow,
                styles.productInfoContainer,
                index !== item?.productData?.length - 1 && styles.borderBottom,
              ]}>
              <View style={styles.imageContainer}>
                <ImageWithBlurBg url={product?.images?.[0]} borderRadius={12} />
              </View>
              <View style={{ flexGrow: 1, flexShrink: 1, marginLeft: 8 }}>
                <Text style={styles.productNameText}>{product.name}</Text>
                <View
                  style={[
                    GlobalStyles.flexRow,
                    { justifyContent: 'flex-start' },
                  ]}>
                  <Text style={styles.quantityText}>
                    Quantity: {product?.orderedQuantity}
                  </Text>
                  <Entypo
                    name="dot-single"
                    size={20}
                    color={Colors.primaryBg}
                    style={styles.dotContainer}
                  />
                  <Text style={styles.priceText}>
                    {currencyUnit}
                    {product?.totalPrice}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 6,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 13,
    color: 'grey',
    fontWeight: '800',
    textAlign: 'left',
  },
  orderHeaderContainer: {
    marginTop: 8,
  },
  orderNumberText: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  detailsText: {
    fontSize: 15,
    color: 'grey',
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'right',
  },
  imageContainer: {
    height: 50,
    width: '20%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productInfoContainer: {
    marginTop: 12,
  },
  productNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  quantityText: {
    fontSize: 14,
    color: Colors.primaryBg,
    fontWeight: '600',
  },
  dotContainer: {
    marginHorizontal: 2,
  },
  priceText: {
    fontSize: 14,
    color: Colors.primaryBg,
    fontWeight: '600',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBrownBg,
    paddingBottom: 12,
  },
});

export default OrderHistoryCard;

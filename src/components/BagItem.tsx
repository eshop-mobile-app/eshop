import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageWithBlurBg from './ImageWithBlurBg';
import GlobalStyles from '../utils/globalStyles';
import Colors from '../utils/colors';
import { currencyUnit } from '../utils/constants';
import { ProductModel } from '../store/services/types';

type BagItemProps = {
  item: ProductModel;
  onRemoveItemFromCart: (arg: string) => any;
  updateQuantity: (id: string, quantity: number) => any;
};

function BagItem(props: BagItemProps): JSX.Element {
  const { item, onRemoveItemFromCart, updateQuantity } = props;
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (item.bagQuantity) {
      setQuantity(item.bagQuantity);
    }
  }, [item.bagQuantity]);

  const updateProductQty = (type: string) => {
    setQuantity((prevState: number) =>
      type === 'increment' ? prevState + 1 : prevState - 1
    );
  };

  useEffect(() => {
    if (quantity && item?.bagQuantity && quantity !== item?.bagQuantity) {
      updateQuantity(item.id, quantity);
    }
  }, [quantity, item?.bagQuantity, item.id, updateQuantity]);

  return (
    <View style={[styles.cardContainer, GlobalStyles.flexRow]}>
      <View style={styles.imageContainer}>
        <ImageWithBlurBg url={item?.images?.[0]} borderRadius={12} />
      </View>
      <View style={[styles.infoContainer]}>
        <View style={GlobalStyles.rowBetween}>
          <Text style={styles.brandText}>{item.brand}</Text>
          <TouchableOpacity
            style={styles.crossContainer}
            onPress={() => onRemoveItemFromCart(item?.id)}>
            <Entypo
              name="cross"
              size={18}
              color="white"
              style={{ textAlign: 'center' }}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameText} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={[GlobalStyles.rowBetween, { width: '100%' }]}>
          <Text style={styles.priceText}>
            {currencyUnit}
            {Number(item.bagQuantity) * Number(item?.price)}
          </Text>
          <View
            style={[GlobalStyles.flexRow, { justifyContent: 'flex-start' }]}>
            <TouchableOpacity
              disabled={quantity === 1}
              style={quantity === 1 && styles.disabled}
              onPress={() => updateProductQty('decrement')}>
              <MaterialCommunityIcons
                name="minus-circle-outline"
                size={30}
                color={Colors.primaryDark}
              />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              disabled={quantity >= Number(item?.availableQuantity)}
              style={
                quantity >= Number(item?.availableQuantity) && styles.disabled
              }
              onPress={() => updateProductQty('increment')}>
              <MaterialCommunityIcons
                name="plus-circle"
                size={30}
                color={Colors.primaryDark}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nameText: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 20,
    maxWidth: '85%',
  },
  crossContainer: {
    height: 25,
    width: 25,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 100,
    width: '30%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  infoContainer: {
    marginLeft: 10,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  disabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    color: Colors.primaryDark,
    fontWeight: '800',
    marginHorizontal: 12,
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
  },
});

export default BagItem;

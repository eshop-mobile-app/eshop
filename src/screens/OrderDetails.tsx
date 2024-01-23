import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CustomBack from '../components/CustomBack';
import Colors from '../utils/colors';
import GlobalStyles from '../utils/globalStyles';
import { currencyUnit } from '../utils/constants';
import { formatSecondsToDate } from '../utils/commonFunctions';
import {
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
} from '../store/services/user';
import CartItem from '../components/CartItem';

type OrderDetailsProps = {
  route: any;
};

function OrderInfo(props: any) {
  const { title, value } = props;

  return (
    <SafeAreaView style={[GlobalStyles.flexRow, { alignItems: 'flex-start' }]}>
      <Text style={styles.leftText}>{title}</Text>
      <Text style={styles.rightText}>{value}</Text>
    </SafeAreaView>
  );
}

function OrderDetails({ route }: OrderDetailsProps): JSX.Element {
  const navigation: any = useNavigation();

  const orderData = route?.params?.orderData;
  const userId = useSelector((state: any) => state.user.userId);
  const { data: currentUser } = useGetCurrentUserQuery<any>(userId);
  const { data: userData } = useGetUserByIdQuery(orderData?.userId, {
    skip: !orderData?.userId,
  });

  return (
    <SafeAreaView>
      <View style={styles.topContainer}>
        <View>
          <CustomBack />
        </View>
        <Text style={styles.welcomeText}>Order Details</Text>
      </View>
      <ScrollView style={[GlobalStyles.p16, { marginBottom: 100 }]}>
        <View style={styles.boxContainer}>
          <OrderInfo
            title="Order date"
            value={formatSecondsToDate(orderData?.orderDate?.seconds)}
          />
          <OrderInfo title="Order #" value={orderData?.orderNumber} />
          <OrderInfo title="Total products" value={orderData?.totalQuantity} />
          {currentUser?.role === 'seller' ? (
            <OrderInfo
              title="Sold by you"
              value={orderData?.productData?.length}
            />
          ) : null}
          <OrderInfo
            title="Order total"
            value={currencyUnit + orderData?.totalPrice}
          />
        </View>
        {currentUser?.role === 'seller' ? (
          <View>
            <Text style={styles.sectionTitle}>Customer details</Text>
            <View style={styles.boxContainer}>
              <OrderInfo title="Name" value={userData?.name} />
              <OrderInfo title="Email" value={userData?.email} />
            </View>
          </View>
        ) : null}
        <View>
          <Text style={styles.sectionTitle}>Product details</Text>
          <View style={styles.boxContainer}>
            {orderData?.productData?.map((item: any, index: number) => {
              const isLastItem = index === orderData?.productData?.length - 1;
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProductDetails', {
                      productId: item?.id,
                    })
                  }
                  key={item.id}>
                  <CartItem
                    isLastItem={isLastItem}
                    item={{
                      ...item,
                      bagQuantity: item?.orderedQuantity,
                    }}
                    key={item.id}
                    page="OrderDetails"
                    orderId={orderData?.id}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: Colors.primaryBg,
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  boxContainer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  leftText: {
    textAlign: 'left',
    width: '40%',
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
  rightText: {
    textAlign: 'left',
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  rateProductContainer: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateProductTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
    textAlign: 'left',
  },
});

export default OrderDetails;

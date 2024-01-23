import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import CustomBack from '../components/CustomBack';
import {
  useGetSellerOrdersQuery,
  useGetUserOrdersQuery,
} from '../store/services/order';
import GlobalStyles from '../utils/globalStyles';
import Colors from '../utils/colors';
import OrderHistoryCard from '../components/OrderHistoryCard';
import { useGetCurrentUserQuery } from '../store/services/user';

function YourOrders(): JSX.Element {
  const userId = useSelector((state: any) => state.user.userId);
  const { data: userData, isLoading: isUserLoading } =
    useGetCurrentUserQuery<any>(userId);
  const { data: orders, isLoading: ordersLoading } = useGetUserOrdersQuery('', {
    skip: userData?.role !== 'customer',
  });
  const { data: sellerOrders, isLoading: sellerOrdersLoading } =
    useGetSellerOrdersQuery('', { skip: userData?.role !== 'seller' });
  return ordersLoading || sellerOrdersLoading || isUserLoading ? (
    <SafeAreaView style={[{ flex: 1 }, GlobalStyles.flexRow]}>
      <ActivityIndicator color={Colors.primaryDark} size={40} />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <CustomBack />
        <Text style={[styles.welcomeText, { width: '70%' }]}>Your orders</Text>
      </View>
      <FlatList
        data={orders || sellerOrders}
        extraData={orders || sellerOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OrderHistoryCard item={item} />}
        ListEmptyComponent={
          <Text style={[GlobalStyles.textCenter, styles.noProductText]}>
            No orders found!
          </Text>
        }
        style={[
          {
            flexGrow: 1,
            zIndex: 200,
          },
        ]}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 150,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    width: '100%',
  },
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
    flexGrow: 1,
    textAlign: 'center',
    marginRight: '12%',
  },
  noProductText: { marginTop: '50%', fontSize: 16, color: Colors.primaryDark },
});

export default YourOrders;

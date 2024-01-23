import * as React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useGetCurrentUserQuery } from '../store/services/user';
import Colors from '../utils/colors';
import { capitalizeText, roundNumbers } from '../utils/commonFunctions';
import GlobalStyles from '../utils/globalStyles';
import { currencyUnit } from '../utils/constants';
import { useGetProductsBySellerQuery } from '../store/services/product';
import { useGetSellerOrdersQuery } from '../store/services/order';
import RevenueLogo from '../assets/images/revenue.png';
import ProductsLogo from '../assets/images/products.png';
import OrdersLogo from '../assets/images/orders.png';
import CustomersLogo from '../assets/images/customers.png';
import StatisticsLogo from '../assets/images/statistics.png';

function SellerDashboard(): JSX.Element {
  const userId = useSelector((state: any) => state.user.userId);
  const navigation: any = useNavigation();
  const { data, isLoading: isUserLoading } =
    useGetCurrentUserQuery<any>(userId);
  const { data: productData, isLoading: isProductLoading } =
    useGetProductsBySellerQuery<any>({
      role: data?.role,
    });
  const [ordersRevenue, setOrdersRevenue] = React.useState(0);
  const [customerCount, setCustomerCount] = React.useState([]);
  const { data: sellerOrders, isLoading: sellerOrdersLoading } =
    useGetSellerOrdersQuery<any>({ isAdmin: data?.role === 'admin' });
  const [options, setOptions] = React.useState<any>([]);

  const onNotificationTap = () => {
    Alert.alert('Coming soon!', 'This feature is future scope. Stay tuned.', [
      { text: 'Ok' },
    ]);
  };

  React.useEffect(() => {
    if (productData?.length || sellerOrders?.length) {
      setOptions([
        {
          icon: StatisticsLogo,
          title: 'Statistics',
          onPress: () => navigation.navigate('Statistics'),
        },
      ]);
    }
    setOptions((prevState: any) => [
      ...prevState,
      {
        role: 'admin',
        icon: StatisticsLogo,
        title: 'Manage categories',
        onPress: () => navigation.navigate('ManageCategory'),
      },
    ]);
  }, [navigation, productData?.length, sellerOrders?.length]);

  React.useEffect(() => {
    if (!sellerOrdersLoading && sellerOrders?.length) {
      const customer: any = [];
      let totalRevenue = 0;
      sellerOrders?.forEach((element: any) => {
        totalRevenue += element?.totalPrice;
        customer.push(element.userId);
      });
      setCustomerCount(
        customer?.filter(
          (value: any, index: any, array: any) => array.indexOf(value) === index
        )
      );
      const converted: any = roundNumbers(totalRevenue);
      setOrdersRevenue(converted);
    }
  }, [sellerOrders, sellerOrdersLoading]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar animated backgroundColor={Colors.primaryBg} />
      {isUserLoading || isProductLoading || sellerOrdersLoading ? (
        <View style={[{ flex: 1 }, GlobalStyles.flexRow]}>
          <ActivityIndicator color={Colors.primaryDark} size={40} />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View
            style={[
              GlobalStyles.rowBetween,
              {
                marginBottom: '8%',
              },
            ]}>
            <Text style={styles.welcomeText} numberOfLines={2}>
              {`Hello, ${capitalizeText(data?.name || 'user')}`}
            </Text>
            <View style={GlobalStyles.flexRow}>
              {data?.id ? (
                <TouchableOpacity
                  onPress={onNotificationTap}
                  style={[
                    styles.notiContainer,
                    {
                      marginLeft: 12,
                      backgroundColor: Colors.primaryDark,
                    },
                  ]}>
                  <Ionicons name="notifications" color="white" size={22} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <View>
            <FlatList
              scrollEnabled={false}
              data={[
                {
                  name: 'Total Sales',
                  value: `${currencyUnit}${ordersRevenue}`,
                  image: RevenueLogo,
                },
                {
                  name: 'Total Products',
                  value: productData?.length,
                  image: ProductsLogo,
                },
                {
                  name: 'Total Orders',
                  value: sellerOrders?.length,
                  image: OrdersLogo,
                },
                {
                  name: 'Total Customers',
                  value: customerCount?.length,
                  image: CustomersLogo,
                },
              ]}
              extraData={[]}
              numColumns={2}
              keyExtractor={(item, index) => item.name + index.toString()}
              renderItem={({ item }) => (
                <View style={[styles.statCardContainer, styles.statsContainer]}>
                  <Image
                    source={item.image}
                    style={{ width: 50, height: 50, marginBottom: 4 }}
                  />
                  <Text style={styles.statsCardTitle}>{item.name}</Text>
                  <Text style={styles.statsCardValue}>{item.value}</Text>
                </View>
              )}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              style={{
                zIndex: 200,
              }}
              contentContainerStyle={{
                flexGrow: 1,
                flexShrink: 1,
                paddingTop: 0,
              }}
            />
          </View>
          {options.map((item: any) =>
            !item?.role || item?.role === data?.role ? (
              <TouchableOpacity
                key={item.title}
                onPress={item.onPress}
                style={[GlobalStyles.rowBetween, styles.statsContainer]}>
                <View style={GlobalStyles.flexRow}>
                  <Image
                    source={item.icon}
                    style={{ width: 40, height: 40, marginRight: 16 }}
                  />
                  <Text
                    style={[
                      styles.statsCardTitle,
                      { fontSize: 20, fontWeight: '600' },
                    ]}>
                    {item.title}
                  </Text>
                </View>

                <Entypo
                  name="chevron-right"
                  color={Colors.primaryDark}
                  size={30}
                  style={{ textAlign: 'right' }}
                />
              </TouchableOpacity>
            ) : null
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: Colors.primaryBg,
    padding: 16,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: '900',
    color: 'white',
    width: '70%',
  },
  topContainer: {
    height: '38%',
    width: '100%',
  },
  notiContainer: {
    backgroundColor: Colors.primaryDark,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  mainStatsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    elevation: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statsSingleContainer: {
    flexGrow: 1,
    borderRightWidth: 1,
    borderRightColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderNone: {
    borderRightWidth: 0,
  },
  statCardContainer: {
    width: '48%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsContainer: {
    backgroundColor: '#E6CCB3',
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statsValue: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  statsTitle: {
    textAlign: 'center',
    fontSize: 15,
    color: 'grey',
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primaryDark,
  },
  statsCardValue: {
    fontSize: 25,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  arrowContainer: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SellerDashboard;

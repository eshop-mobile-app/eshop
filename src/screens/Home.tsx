import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { debounce } from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { useGetCurrentUserQuery } from '../store/services/user';
import {
  useGetCategoriesQuery,
  useGetProductsBySellerQuery,
} from '../store/services/product';
import Colors from '../utils/colors';
import CustomSearchBar from '../components/CustomSearchBar';
import FilterIcon from '../assets/images/filter.png';
import { capitalizeText } from '../utils/commonFunctions';
import GlobalStyles from '../utils/globalStyles';
import ProductCard from '../components/ProductCard';

function Home(): JSX.Element {
  const userId = useSelector((state: any) => state.user.userId);
  const { data, isLoading: isUserLoading } =
    useGetCurrentUserQuery<any>(userId);
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const userCart = useSelector((state: any) => state.cart.userCart);
  const { data: categoryData, isLoading: isCategoryLoading } =
    useGetCategoriesQuery<any>();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSortOrder, setSelectedSortOrder] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const { data: productData, isLoading: isProductLoading } =
    useGetProductsBySellerQuery<any>(
      {
        categoryId: selectedCategory,
        role: data?.role,
        searchKey,
        filter: selectedSortOrder,
      },
      { skip: !categoryData?.length || !selectedCategory }
    );
  const [isLoading, setIsLoading] = useState(false);
  const [displayedData, setDisplayedData] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(isProductLoading);
  }, [isProductLoading]);

  useEffect(() => {
    setIsLoading(true);
    const productsClone: any[] = productData?.length
      ? JSON.parse(JSON.stringify(productData))
      : [];
    if (searchKey?.trim()?.length && selectedSortOrder) {
      if (selectedSortOrder === 'LtH') {
        productsClone.sort((a: any, b: any) => a.price - b.price);
      } else {
        productsClone.sort((a: any, b: any) => b.price - a.price);
      }
      setDisplayedData(productsClone);
      setIsLoading(false);
    } else {
      setDisplayedData(productData);
      setIsLoading(false);
    }
  }, [productData, searchKey, selectedSortOrder]);

  const navigation: any = useNavigation();

  useEffect(() => {
    const cartData = data?.id ? data?.cart : userCart;
    if (cartData?.length) {
      let cartTotal = 0;
      cartData?.forEach((item: any) => {
        cartTotal += item.quantity;
      });
      setCartTotalQty(cartTotal);
    } else {
      setCartTotalQty(0);
    }
  }, [data?.id, data?.cart, userCart]);

  const sortOptions: any = [
    { key: 'LtH', title: 'Price: Low to high' },
    { key: 'HtL', title: 'Price: High to low' },
    { title: 'Reset' },
  ];

  const actionSheetRef: any = useRef();
  useEffect(() => {
    if (categoryData?.length) {
      setSelectedCategory(categoryData?.[0]?.id);
    }
  }, [categoryData]);

  const onNotificationTap = () => {
    Alert.alert('Coming soon!', 'This feature is future scope. Stay tuned.', [
      { text: 'Ok' },
    ]);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar animated backgroundColor={Colors.primaryBg} />
      {isCategoryLoading || isUserLoading || isProductLoading || isLoading ? (
        <View style={[{ flex: 1 }, GlobalStyles.flexRow]}>
          <ActivityIndicator color={Colors.primaryDark} size={40} />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.topContainer}>
            {!data?.id || data?.role === 'customer' ? (
              <View
                style={[
                  GlobalStyles.rowBetween,
                  {
                    marginBottom: '8%',
                  },
                ]}>
                <Text style={styles.welcomeText} numberOfLines={2}>
                  Hello,
                  {capitalizeText(data?.name || 'user')}
                </Text>
                <View style={GlobalStyles.flexRow}>
                  {!data?.id || data?.role === 'customer' ? (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ShoppingBag');
                        }}
                        style={[
                          styles.notiContainer,
                          {
                            backgroundColor: Colors.primaryDark,
                          },
                        ]}>
                        <Ionicons name="bag-handle" color="white" size={21} />
                      </TouchableOpacity>
                      {cartTotalQty ? (
                        <View
                          style={{
                            backgroundColor: 'red',
                            height: 22,
                            width: 22,
                            borderRadius: 30,
                            position: 'absolute',
                            right: -6,
                            top: -9,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 14,
                              fontWeight: '900',
                              color: 'white',
                            }}>
                            {cartTotalQty}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}
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
            ) : null}
            <View style={styles.searchFilterContainer}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <CustomSearchBar
                  onChangeText={debounce(setSearchKey, 500)}
                  onClear={() => setSearchKey('')}
                />
              </View>
              {!data?.role || data?.role === 'customer' ? (
                <TouchableOpacity
                  style={styles.filterContainer}
                  onPress={() => actionSheetRef.current.show()}>
                  <Image source={FilterIcon} style={styles.filterIcon} />
                  {selectedSortOrder ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        height: 12,
                        width: 12,
                        borderRadius: 16,
                        backgroundColor: 'red',
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('AddProduct');
                  }}
                  style={[
                    styles.notiContainer,
                    {
                      backgroundColor: Colors.primaryDark,
                    },
                  ]}>
                  <Entypo name="plus" color="white" size={25} />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={[
                { alignItems: 'flex-start', marginTop: '8%' },
              ]}>
              {categoryData?.map((item: any) => (
                <TouchableWithoutFeedback
                  key={item.id}
                  onPress={() => setSelectedCategory(item.id)}>
                  <View
                    style={
                      selectedCategory === item.id
                        ? styles.selectedCategoryCapsule
                        : styles.categoryCapsule
                    }>
                    <Text
                      style={
                        selectedCategory === item.id
                          ? styles.selectedCategoryName
                          : styles.categoryName
                      }>
                      {capitalizeText(item.name)}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
          </View>
          {categoryData?.length ? (
            <View style={styles.bottomContainer}>
              {isProductLoading || displayedData === null ? (
                <View style={{ marginTop: '25%' }}>
                  <ActivityIndicator color={Colors.primaryDark} size={35} />
                </View>
              ) : (
                <FlatList
                  data={displayedData}
                  extraData={displayedData}
                  numColumns={2}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => <ProductCard item={item} />}
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                  ListEmptyComponent={
                    <Text
                      style={[GlobalStyles.textCenter, styles.noProductText]}>
                      No product in selected category!
                    </Text>
                  }
                  style={{
                    flexGrow: 1,
                    marginTop:
                      !data?.id || data?.role === 'customer' ? '-14%' : '-31%',
                    zIndex: 200,
                  }}
                  contentContainerStyle={{
                    paddingBottom: 80,
                    padding: 20,
                    paddingTop: 0,
                  }}
                />
              )}
            </View>
          ) : null}
          <ActionSheet
            ref={actionSheetRef}
            title="Select sort order"
            options={
              Platform.OS === 'ios'
                ? sortOptions.map((item: any) => item.title)
                : sortOptions?.map((item: any) => (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: item === selectedCategory ? '600' : '400',
                      }}>
                      {item.title}
                    </Text>
                  ))
            }
            cancelButtonIndex={2}
            destructiveButtonIndex={2}
            onPress={(index: any) => {
              setSelectedSortOrder(sortOptions[index].key);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    width: '100%',
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: '900',
    color: 'white',
    width: '70%',
  },
  topContainer: {
    backgroundColor: Colors.primaryBg,
    height: '38%',
    width: '100%',
    padding: 20,
  },
  bottomContainer: {
    backgroundColor: '#F7F4F3',
    height: '62%',
    width: '100%',
  },
  filterContainer: {
    backgroundColor: Colors.primaryDark,
    height: 46,
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  filterIcon: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  notiContainer: {
    backgroundColor: Colors.primaryDark,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCategoryCapsule: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Colors.bgOpaqueBrown,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: Colors.bgOpaqueBrown,
  },
  selectedCategoryName: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.primaryDark,
  },
  categoryCapsule: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
  },
  noProductText: { marginTop: '50%', fontSize: 16, color: Colors.primaryDark },
});

export default Home;

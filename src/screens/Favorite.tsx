import * as React from 'react';
import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import ProductList from '../components/ProductList';
import { useGetUserFavoritesQuery } from '../store/services/product';
import { useGetCurrentUserQuery } from '../store/services/user';
import GlobalStyles from '../utils/globalStyles';
import CustomSearchBar from '../components/CustomSearchBar';

import Colors from '../utils/colors';

function Favorite(): JSX.Element {
  const userId = useSelector((state: any) => state.user.userId);
  const { data } = useGetCurrentUserQuery<any>(userId);
  const [searchKey, setSearchKey] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const { data: favoritesData } = useGetUserFavoritesQuery<any>(
    {
      searchKey,
    },
    { skip: data?.role !== 'customer' }
  );

  return (
    <SafeAreaView>
      <View style={styles.topContainer}>
        <View
          style={[
            GlobalStyles.rowBetween,
            {
              marginBottom: showSearch ? '5%' : 0,
            },
          ]}>
          <Text style={styles.welcomeText} numberOfLines={2}>
            Your favorites
          </Text>
          <TouchableOpacity
            style={styles.filterContainer}
            onPress={() => setShowSearch(prevState => !prevState)}>
            {showSearch ? (
              <Entypo name="cross" size={22} color="white" />
            ) : (
              <Feather name="search" size={22} color="white" />
            )}
          </TouchableOpacity>
        </View>
        {showSearch ? (
          <View style={styles.searchFilterContainer}>
            <View style={{ flex: 1 }}>
              <CustomSearchBar
                onChangeText={debounce(setSearchKey, 500)}
                onClear={() => setSearchKey('')}
              />
            </View>
          </View>
        ) : null}
      </View>
      <ProductList
        productData={favoritesData}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: showSearch ? '22%' : '5%',
        }}
        style={{
          paddingVerticalBottom: 20,
          height: '80%',
          marginTop: '-15%',
          zIndex: 200,
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
  welcomeText: {
    fontSize: 25,
    fontWeight: '900',
    color: 'white',
    width: '70%',
  },
  topContainer: {
    backgroundColor: Colors.primaryBg,
    width: '100%',
    padding: 20,
    paddingBottom: 90,
  },
  bottomContainer: {
    backgroundColor: '#F7F4F3',
    flexGrow: 1,
    width: '100%',
  },
  filterContainer: {
    backgroundColor: Colors.primaryDark,
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
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
  noProductText: { marginTop: '50%', fontSize: 16, color: Colors.primaryDark },
});

export default Favorite;

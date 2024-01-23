import * as React from 'react';
import { Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetCurrentUserQuery } from '../store/services/user';
import { useGetUserFavoritesQuery } from '../store/services/product';
import Colors from '../utils/colors';
import GlobalStyles from '../utils/globalStyles';
import ProductCard from './ProductCard';

function ProductList(props: any): JSX.Element {
  const { productData } = props;
  const userId = useSelector((state: any) => state.user.userId);
  const { data } = useGetCurrentUserQuery<any>(userId);

  const { data: favoritesData } = useGetUserFavoritesQuery<any>(
    {},
    { skip: data?.role !== 'customer' }
  );

  return (
    <FlatList
      data={productData}
      extraData={productData}
      numColumns={2}
      keyExtractor={item => item.name}
      renderItem={({ item }) => (
        <ProductCard
          item={item}
          isFavorite={
            favoritesData?.length &&
            favoritesData?.find(
              (favorite: any) => favorite.productId === item.id
            )
          }
        />
      )}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      ListEmptyComponent={
        <Text style={[GlobalStyles.textCenter, styles.noProductText]}>
          No product in selected category!
        </Text>
      }
      style={[
        {
          flexGrow: 1,
          zIndex: 200,
          ...(props?.style || {}),
        },
      ]}
      contentContainerStyle={{
        paddingBottom: 80,
        paddingTop: 0,
        ...(props?.contentContainerStyle || {}),
      }}
    />
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
  notiContainer: {
    backgroundColor: Colors.primaryDark,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  filterIcon: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryCapsule: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  selectedCategoryCapsule: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  selectedCategoryName: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
  },
  noProductText: { marginTop: '50%', fontSize: 16, color: Colors.primaryDark },
});

export default ProductList;

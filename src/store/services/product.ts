/* eslint-disable no-promise-executor-return */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  updateFavoriteProduct,
  addNewProduct,
  updateProduct,
  updateCart,
  addNewCategory,
  updateCategory,
} from '../functions';
import {
  CategoryModel,
  ProductModel,
  ProductQueryModel,
  ReviewModel,
  ReviewProductModel,
  UserCartModel,
  UserRoleModel,
} from './types';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: ['BagProducts'],
  endpoints: builder => ({
    getCategories: builder.query<CategoryModel[] | null, void>({
      queryFn() {
        return { data: null };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          let categoryQuery: FirebaseFirestoreTypes.Query =
            firestore().collection('category');
          categoryQuery = categoryQuery.where('isDisabled', '==', false);
          unsubscribe = categoryQuery.onSnapshot(
            (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
              const all: CategoryModel[] = [];
              querySnapshot?.docs.forEach(
                (doc: FirebaseFirestoreTypes.DocumentData) => {
                  all.push(doc.data());
                }
              );
              updateCachedData(() => all);
            }
          );
        } catch (err) {
          throw err;
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
    }),
    addProduct: builder.mutation<Partial<ProductModel>, Partial<ProductModel>>({
      async queryFn(data) {
        const response: Partial<ProductModel> = await addNewProduct(data);
        return { data: response };
      },
    }),
    getUserBagProducts: builder.query({
      queryFn() {
        return { data: null };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          const productIds = arg?.map((item: UserCartModel) => item.productId);
          let productQuery: FirebaseFirestoreTypes.Query =
            firestore().collection('products');
          if (productIds?.length) {
            productQuery = productQuery.where('id', 'in', productIds);
          }
          const productsSnapshot = await productQuery.get();

          const productPromise = productsSnapshot?.docs?.map(
            async (doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
              const productData = doc.data();
              let categoryQuery: FirebaseFirestoreTypes.Query =
                firestore().collection('category');
              const categorySnapshot = await categoryQuery.get();
              if (productData?.categoryId) {
                categoryQuery = categoryQuery.where(
                  'id',
                  '==',
                  productData?.categoryId
                );
              }
              const categoryId = categorySnapshot.docs.map(
                (categoryDoc: FirebaseFirestoreTypes.DocumentSnapshot) =>
                  categoryDoc.data()
              );
              const finalData = { ...productData, category: categoryId };
              return finalData;
            }
          );
          const finalData: any = await Promise.all(productPromise);
          updateCachedData(() => finalData);
          unsubscribe?.();
        } catch (err) {
          throw err;
        }
        await cacheEntryRemoved;
        unsubscribe?.();
      },
    }),
    updateFavoriteProduct: builder.mutation<
      Partial<ProductModel>,
      Partial<ProductModel>
    >({
      async queryFn(data) {
        const response: Partial<ProductModel> = await updateFavoriteProduct(
          data
        );
        return { data: response };
      },
    }),
    updateProduct: builder.mutation<
      Partial<ProductModel>,
      Partial<ProductModel>
    >({
      async queryFn(data) {
        const response: Partial<ProductModel> = await updateProduct(data);
        return { data: response };
      },
    }),
    getProductsBySeller: builder.query<
      ProductModel[] | null,
      ProductQueryModel
    >({
      queryFn() {
        return { data: null };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          const currentUser: string | undefined = auth().currentUser?.uid;
          let productQuery: FirebaseFirestoreTypes.Query =
            firestore().collection('products');
          if (arg?.categoryId) {
            productQuery = productQuery.where(
              'categoryId',
              '==',
              arg?.categoryId
            );
          }
          if (arg?.role === UserRoleModel.seller && currentUser) {
            productQuery = productQuery.where('sellerId', '==', currentUser);
          } else {
            productQuery = productQuery.where('isDisabled', '==', false);
          }
          if (arg?.filter && !arg?.searchKey) {
            productQuery = productQuery.orderBy(
              'price',
              arg.filter === 'LtH' ? 'asc' : 'desc'
            );
          }
          if (arg?.searchKey) {
            const inputValue = arg?.searchKey;
            productQuery = productQuery
              .orderBy('name')
              .startAt(inputValue)
              .endAt(`${inputValue}\uf8ff`);
          }
          unsubscribe = productQuery.onSnapshot(
            (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
              const all: ProductModel[] = [];
              querySnapshot?.docs.forEach(
                (doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
                  const documentData: any = doc.data();
                  all.push(documentData);
                }
              );
              updateCachedData(() => all);
            }
          );
        } catch (err) {
          throw err;
        }
        await cacheEntryRemoved;
        unsubscribe?.();
      },
    }),
    getUserFavorites: builder.query<ProductModel[] | null, ProductQueryModel>({
      queryFn() {
        return { data: null };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          const currentUser: string | undefined = auth().currentUser?.uid;
          if (currentUser) {
            let categoryQuery = firestore()
              .collection('products')
              .where('favorites', 'array-contains', currentUser);
            if (arg?.searchKey) {
              const inputValue = arg?.searchKey;
              categoryQuery = categoryQuery
                .orderBy('name')
                .startAt(inputValue)
                .endAt(`${inputValue}\uf8ff`);
            }

            unsubscribe = categoryQuery.onSnapshot(
              (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
                const all: ProductModel[] = [];
                querySnapshot.docs.forEach(
                  (doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
                    const documentData: any = doc?.data();
                    all.push(documentData);
                  }
                );
                updateCachedData(() => all);
              }
            );
          }
        } catch (err) {
          throw err;
        }
        await cacheEntryRemoved;
        unsubscribe?.();
      },
    }),
    getProductReviews: builder.query({
      queryFn(data) {
        return { data };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          const productQuery = firestore()
            .collection('reviews')
            .where('productId', '==', arg?.productId)
            .orderBy('datePosted', 'desc');
          unsubscribe = productQuery.onSnapshot(async querySnapshot => {
            const productPromise = querySnapshot?.docs.map(async doc => {
              const reviewData = doc?.data();
              let userQuery: FirebaseFirestoreTypes.Query =
                firestore().collection('users');
              if (reviewData?.userId) {
                userQuery = userQuery.where('id', '==', reviewData?.userId);
              }
              const userSnapshot = await userQuery.get();
              const userData = userSnapshot?.docs?.map(
                (userDoc: FirebaseFirestoreTypes.DocumentSnapshot) =>
                  userDoc.data()
              );
              return { ...reviewData, userData: userData?.[0] };
            });
            const reviewFinalData = await Promise.all(productPromise);
            updateCachedData(() => reviewFinalData);
          });
        } catch (err) {
          throw err;
        }
        await cacheEntryRemoved;
        unsubscribe?.();
      },
    }),
    getProductById: builder.query({
      queryFn(data) {
        return { data };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          firestore()
            .collection('products')
            .doc(arg.productId)
            .onSnapshot(
              snapshot => {
                const itemData = snapshot?.data();
                updateCachedData(() => itemData);
              },
              error => {
                throw error;
              }
            );
        } catch (error) {
          throw error;
        }
        await cacheEntryRemoved;
      },
    }),
    getSellerReviewProducts: builder.query<
      ReviewModel[] | null,
      ReviewProductModel
    >({
      queryFn() {
        return { data: null };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          const currentUser: string | undefined = auth().currentUser?.uid;
          let productQuery: FirebaseFirestoreTypes.Query =
            firestore().collection('reviews');
          if (!arg?.isAdmin && currentUser) {
            productQuery = productQuery.where('sellerId', '==', currentUser);
          }
          productQuery = productQuery.orderBy('rating', 'desc');
          unsubscribe = productQuery.onSnapshot(
            async (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
              const reviewsPromise = querySnapshot?.docs?.map(
                async (doc: FirebaseFirestoreTypes.DocumentData) => {
                  const reviewData = doc?.data();
                  let reviewProductQuery: FirebaseFirestoreTypes.Query =
                    firestore().collection('products');
                  if (reviewData?.productId) {
                    reviewProductQuery = reviewProductQuery.where(
                      'id',
                      '==',
                      reviewData?.productId
                    );
                  }
                  const productSnapshot = await reviewProductQuery.get();
                  const productData = productSnapshot?.docs.map(
                    (categoryDoc: FirebaseFirestoreTypes.DocumentData) =>
                      categoryDoc.data()
                  );
                  const finalData = {
                    ...reviewData,
                    product: productData?.[0],
                  };
                  return finalData;
                }
              );
              if (reviewsPromise) {
                const finalData: ReviewModel[] = await Promise.all(
                  reviewsPromise
                );
                updateCachedData(() => finalData);
              }
            }
          );
        } catch (err) {
          throw err;
        }
        await cacheEntryRemoved;
        unsubscribe?.();
      },
    }),
    updateCart: builder.mutation<
      Partial<UserCartModel>,
      Partial<UserCartModel[]>
    >({
      async queryFn(data) {
        const response: UserCartModel = await updateCart(data);
        return { data: response };
      },
    }),
    addCategory: builder.mutation<
      Partial<CategoryModel>,
      Partial<CategoryModel>
    >({
      async queryFn(data) {
        const response: Partial<CategoryModel> = await addNewCategory(data);
        return { data: response };
      },
    }),
    updateCategory: builder.mutation<
      Partial<CategoryModel>,
      Partial<CategoryModel>
    >({
      async queryFn(data) {
        const response: Partial<CategoryModel> = await updateCategory(data);
        return { data: response };
      },
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddProductMutation,
  useUpdateFavoriteProductMutation,
  useUpdateProductMutation,
  useGetProductsBySellerQuery,
  useGetUserFavoritesQuery,
  useGetProductByIdQuery,
  useGetProductReviewsQuery,
  useUpdateCartMutation,
  useGetUserBagProductsQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useGetSellerReviewProductsQuery,
} = productApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  addProductReview,
  placeOrder,
  updateProductReview,
} from '../functions';
import { getFirestoreDataByTimeRange } from '../../utils/commonFunctions';
import { OrderModel, ProductModel, ReviewModel } from './types';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: builder => ({
    placeOrder: builder.mutation<Partial<OrderModel>, Partial<OrderModel>>({
      async queryFn(data) {
        const response: Partial<OrderModel> = await placeOrder(data);
        return { data: response };
      },
    }),
    addReview: builder.mutation<Partial<ReviewModel>, Partial<ReviewModel>>({
      async queryFn(data) {
        const response: Partial<ReviewModel> = await addProductReview(data);
        return { data: response };
      },
    }),
    updateReview: builder.mutation<
      Partial<ReviewModel> | void,
      Partial<ReviewModel>
    >({
      async queryFn(data) {
        const response: Partial<ReviewModel> | void = await updateProductReview(
          data
        );
        return { data: response };
      },
    }),
    getUserOrders: builder.query<null, void>({
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
            const productQuery = firestore()
              .collection('orders')
              .where('userId', '==', currentUser)
              .orderBy('orderDate', 'desc');
            unsubscribe = productQuery.onSnapshot(querySnapshot => {
              const all: any = [];
              querySnapshot?.docs.forEach(
                (doc: FirebaseFirestoreTypes.DocumentData) => {
                  all.push(doc?.data());
                }
              );
              updateCachedData(() => all);
            });
          }
        } catch (err) {
          throw err;
        }
        await cacheEntryRemoved;
        unsubscribe?.();
      },
    }),
    getOrderProductReviews: builder.query({
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
          if (arg?.userId && arg?.productId && arg?.orderId) {
            const productQuery = firestore()
              .collection('reviews')
              .where('userId', '==', arg?.userId)
              .where('productId', '==', arg?.productId)
              .where('orderId', '==', arg?.orderId);
            unsubscribe = productQuery.onSnapshot(querySnapshot => {
              let all: any = {};
              querySnapshot?.docs.forEach(doc => {
                all = doc?.data();
              });
              updateCachedData(() => all);
            });
          }
        } catch (err) {
          throw err;
        }
        await cacheEntryRemoved;
        unsubscribe?.();
      },
    }),
    getSellerOrders: builder.query({
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

          let productQuery: any = firestore().collection('orders');
          if (arg?.filter) {
            const filterRange = getFirestoreDataByTimeRange(
              arg?.filter?.toLowerCase()
            );
            if (filterRange?.startDate && filterRange?.endDate) {
              productQuery = productQuery
                .where('orderDate', '>=', filterRange?.startDate)
                .where('orderDate', '<=', filterRange?.endDate);
            }
          }
          if (!arg?.isAdmin && currentUser) {
            productQuery = productQuery.where(
              'sellers',
              'array-contains',
              currentUser
            );
          }

          unsubscribe = productQuery.onSnapshot(
            (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
              const all: any = [];
              querySnapshot?.docs.forEach(
                (doc: FirebaseFirestoreTypes.DocumentData) => {
                  const orderData = JSON.parse(JSON.stringify(doc?.data()));
                  if (!arg?.isAdmin) {
                    orderData.productData = orderData?.productData?.filter(
                      (item: ProductModel) => item.sellerId === currentUser
                    );
                  }
                  all.push(orderData);
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
  }),
});

export const {
  usePlaceOrderMutation,
  useGetUserOrdersQuery,
  useGetSellerOrdersQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useGetOrderProductReviewsQuery,
} = orderApi;

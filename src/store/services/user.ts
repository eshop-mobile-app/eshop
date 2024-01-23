import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { createNewUser } from '../functions';
import { UserModel } from './types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: builder => ({
    getCurrentUser: builder.query({
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
          const userId = arg;
          const userQuery = firestore().collection('users').doc(userId);
          unsubscribe = userQuery.onSnapshot(
            (documentSnapshot: FirebaseFirestoreTypes.DocumentData) => {
              const updatedData = documentSnapshot?.data();
              updateCachedData(() => updatedData);
            }
          );
        } catch (err) {
          console.log('err', err);
        }
        await cacheEntryRemoved;
        unsubscribe?.();
      },
    }),
    getUserById: builder.query({
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
            .collection('users')
            .doc(arg)
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
    createUser: builder.mutation<Partial<UserModel>, UserModel>({
      async queryFn(data) {
        const response: UserModel = await createNewUser(data);
        return { data: response };
      },
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
} = userApi;

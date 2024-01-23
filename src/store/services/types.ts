import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export enum UserRoleModel {
  'admin',
  'customer',
  'seller',
}

export type UserCartModel = {
  productId: string;
  quantity: number;
};

export type UserModel = {
  name: string;
  role: UserRoleModel;
  email: string;
  id: string;
  cart?: UserCartModel[];
};

export type CategoryModel = {
  name: string;
  id: string;
  isDisabled: boolean;
};

export type ReviewModel = {
  datePosted: string | FirebaseFirestoreTypes.FieldValue;
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  userId: string;
  rating: number;
  comment?: string;
};

export type ProductModel = {
  availableQuantity: string;
  brand: string;
  categoryId: string;
  description: string;
  favorites?: string[];
  id: string;
  images: string[];
  isDisabled?: boolean;
  name: string;
  price: number;
  sellerId: string;
  bagQuantity?: number;
};

export type Timestamp = {
  nanoseconds: number;
  seconds: number;
};

export type OrderModel = {
  id: string;
  orderDate: Timestamp;
  orderNumber: string;
  productData: ProductModel[];
  productIds: string[];
  sellers: string[];
  totalPrice: number;
  totalQuantity: number;
  userId: string;
};

export type ChartDataModel = {
  x: string;
  y: number;
};

export type ProductQueryModel = {
  categoryId?: string;
  role?: UserRoleModel;
  filter?: string;
  searchKey?: string;
};

export type ReviewProductModel = {
  isAdmin?: boolean;
};

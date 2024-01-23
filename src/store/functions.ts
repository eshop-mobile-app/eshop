/* eslint-disable @typescript-eslint/restrict-template-expressions */
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import auth, { firebase } from '@react-native-firebase/auth';
import { ProductModel } from './services/types';

const createNewUser = async (data: any) => {
  const documentId = data.id;
  try {
    await firestore()
      .collection('users')
      .doc(documentId)
      .set(data)
      .then(async () => {
        await firestore()
          .collection('users')
          .doc(documentId)
          .update({ id: documentId });
      });

    return data;
  } catch (err) {
    throw err;
  }
};

const addNewCategory = async (data: any) => {
  try {
    await firestore()
      .collection('category')
      .add(data)
      .then(async documentRef => {
        await firestore()
          .collection('category')
          .doc(documentRef.id)
          .update({ id: documentRef.id });
      });

    return data;
  } catch (err) {
    throw err;
  }
};

const updateCategory = async (data: any) => {
  try {
    await firestore().collection('category').doc(data?.id).update(data);
    return data;
  } catch (err) {
    throw err;
  }
};

const addNewProduct = async (data: any) => {
  try {
    const uploadPromises = data.images.map(async (image: any) => {
      const fileName: any = `${data.name}_${uuid.v4()}`;
      const reference = storage().ref(`images/${fileName}`);
      await reference.putFile(image);
      const url = await reference.getDownloadURL();
      return url;
    });
    const uploadedUrls = await Promise.all(uploadPromises);
    const finalData = { ...data, images: uploadedUrls };
    if (uploadedUrls.length > 0) {
      await firestore()
        .collection('products')
        .add(finalData)
        .then(async documentRef => {
          await firestore()
            .collection('products')
            .doc(documentRef.id)
            .update({ id: documentRef.id });
        });
      return finalData;
    }
    return false;
  } catch (err) {
    throw err;
  }
};

const updateFavoriteProduct = async (data: Partial<ProductModel>) => {
  try {
    await firestore()
      .collection('products')
      .doc(data.id)
      .update({ favorites: data.favorites });

    return data;
  } catch (err) {
    throw err;
  }
};

const updateCart = async (data: any) => {
  try {
    const userId = auth().currentUser?.uid;
    await firestore().collection('users').doc(userId).update({ cart: data });
    return data;
  } catch (err) {
    throw err;
  }
};

const updateProduct = async (data: any) => {
  try {
    let uploadedUrls: string[] = [];
    if (data?.images) {
      const uploadPromises = data.images.map(async (image: any) => {
        if (image.includes('firebasestorage.googleapis.com')) {
          return image;
        }
        const fileName: any = `${data.name}_${uuid.v4()}`;
        const reference = storage().ref(`images/${fileName}`);
        await reference.putFile(image);
        const url = await reference.getDownloadURL();
        return url;
      });
      uploadedUrls = await Promise.all(uploadPromises);
    }

    const finalData = { ...data };
    if (!data?.image || uploadedUrls.length > 0) {
      if (uploadedUrls?.length) {
        finalData.images = uploadedUrls;
      }
      await firestore()
        .collection('products')
        .doc(finalData.id)
        .update(finalData);

      return finalData;
    }
    return false;
  } catch (err) {
    throw err;
  }
};

const updateCartQuantity = async (data: any) => {
  try {
    const currentUser = auth().currentUser?.uid;
    return await firestore().collection('users').doc(currentUser).update({
      cart: data,
    });
  } catch (err) {
    throw err;
  }
};

const placeOrder = async (data: any) => {
  try {
    let id = '';
    await firestore()
      .collection('orders')
      .add(data)
      .then(async documentRef => {
        id = documentRef.id;
        await firestore()
          .collection('orders')
          .doc(documentRef.id)
          .update({ id: documentRef.id });
      });
    return { ...data, id };
  } catch (err) {
    throw err;
  }
};

const addProductReview = async (data: any) => {
  try {
    let id = '';
    await firestore()
      .collection('reviews')
      .add(data)
      .then(async documentRef => {
        id = documentRef.id;
        await firestore()
          .collection('reviews')
          .doc(documentRef.id)
          .update({ id: documentRef.id });
      });
    return { ...data, id };
  } catch (err) {
    throw err;
  }
};

const updateProductReview = async (data: any) => {
  try {
    return await firestore().collection('reviews').doc(data?.id).update(data);
  } catch (err) {
    throw err;
  }
};

const clearCart = async () => {
  try {
    const currentUser = auth().currentUser?.uid;
    await firestore().collection('users').doc(currentUser).update({
      cart: firebase.firestore.FieldValue.delete(),
    });
  } catch (err) {
    throw err;
  }
};

export {
  createNewUser,
  addNewCategory,
  addNewProduct,
  updateProduct,
  updateFavoriteProduct,
  updateCart,
  updateCartQuantity,
  placeOrder,
  clearCart,
  updateCategory,
  addProductReview,
  updateProductReview,
};

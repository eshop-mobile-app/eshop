import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';
import CustomTextInput from '../components/CustomTextInput';
import CustomDropdown from '../components/CustomDropdown';
import Colors from '../utils/colors';
import CustomImagePicker from '../components/CustomImagePicker';
import CustomButton from '../components/CustomButton';
import {
  useAddProductMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from '../store/services/product';
import { capitalizeText } from '../utils/commonFunctions';
import { useGetCurrentUserQuery } from '../store/services/user';
import CustomHeader from '../components/CustomHeader';

type AddProductProps = {
  route: any;
};

function AddProduct({ route }: AddProductProps): JSX.Element {
  const selectedProduct = route?.params?.productData;
  const navigation = useNavigation();
  const isEditMode = selectedProduct && Object.keys(selectedProduct)?.length;
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [availableQty, setAvailableQty] = useState('');
  const [category, setSelectedCategory] = useState<any>({});
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: categories } = useGetCategoriesQuery<any>('active');
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const userId = useSelector((state: any) => state.user.userId);
  const { data: userData } = useGetCurrentUserQuery<any>(userId);

  useEffect(() => {
    if (isEditMode) {
      const selectedCategoryData = categories?.find(
        (item: any) => item.id === selectedProduct.categoryId
      );
      setProductName(selectedProduct?.name);
      setProductDescription(selectedProduct?.description);
      setBrand(selectedProduct?.brand);
      setSelectedCategory(selectedCategoryData);
      setPrice(selectedProduct?.price?.toString());
      setAvailableQty(selectedProduct?.availableQuantity);
      setImages(selectedProduct?.images);
    }
  }, [isEditMode, selectedProduct, categories]);

  const resetFields = () => {
    setProductName('');
    setProductDescription('');
    setBrand('');
    setSelectedCategory({});
    setPrice('');
    setAvailableQty('');
    setImages([]);
  };
  const descriptionFieldRef: any = useRef();
  const brandFieldRef: any = useRef();
  const quantityFieldRef: any = useRef();

  const onAddProduct = async () => {
    setIsLoading(true);
    if (
      !productName?.trim()?.length ||
      !productDescription?.trim()?.length ||
      !brand?.trim()?.length ||
      !Number(price) ||
      !availableQty?.trim()?.length ||
      !category?.id
    ) {
      setIsLoading(false);
      return;
    }
    if (!images?.length) {
      Alert.alert('Please add atleast 1 product image');
      setIsLoading(false);
      return;
    }
    const productData: any = {
      name: productName,
      description: productDescription,
      brand,
      price: Number(price),
      availableQuantity: availableQty,
      categoryId: category?.id,
      images,
      sellerId: userData?.id,
      isDisabled: selectedProduct?.isDisabled || false,
    };

    if (isEditMode) {
      productData.id = selectedProduct?.id;
      await updateProduct?.(productData)
        .then(() => {
          Toast.show('Product updated successfully', 2000);
          resetFields();
          navigation.goBack();
        })
        .catch((error: any) => {
          console.log({ error });
        });
      setIsLoading(false);
    } else {
      await addProduct?.(productData)
        ?.then(() => {
          Toast.show('Product added successfully', 2000);
          resetFields();
          navigation.goBack();
        })
        .catch((error: any) => {
          console.log({ error });
        });
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <CustomHeader
        title={`${isEditMode ? 'Update' : 'Add new '} product`}
        showBack
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.mainContainer}
        extraHeight={200}>
        <CustomTextInput
          placeholder="Product title"
          onChangeText={setProductName}
          value={productName}
          onSubmitEditing={() => {
            descriptionFieldRef?.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <CustomTextInput
          inputRef={descriptionFieldRef}
          placeholder="Product description"
          onChangeText={setProductDescription}
          value={productDescription}
          onSubmitEditing={() => {
            brandFieldRef?.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <CustomTextInput
          inputRef={brandFieldRef}
          placeholder="Brand"
          onChangeText={setBrand}
          value={brand}
        />
        <CustomDropdown
          options={(categories || [])?.map((item: any) =>
            capitalizeText(item.name)
          )}
          placeholder="Select category"
          onSelect={(index: number) => setSelectedCategory(categories[index])}
          selectedCategory={category?.name}
        />
        <CustomTextInput
          placeholder="Price"
          keyboardType="numeric"
          onChangeText={setPrice}
          value={price}
          onSubmitEditing={() => {
            quantityFieldRef?.current?.focus();
          }}
          blurOnSubmit={false}
        />
        <CustomTextInput
          inputRef={quantityFieldRef}
          placeholder="Available quantity"
          keyboardType="numeric"
          onChangeText={setAvailableQty}
          value={availableQty}
          onSubmitEditing={onAddProduct}
        />
        <CustomImagePicker onSelectImage={setImages} selectedImages={images} />
        <View style={styles.addButton}>
          <CustomButton
            loading={isLoading}
            buttonText={isEditMode ? 'Update' : 'Add'}
            onPress={onAddProduct}
            disabled={
              !productName ||
              !productDescription ||
              !brand ||
              !Object.keys(category)?.length ||
              !price ||
              !availableQty ||
              isLoading ||
              !Object.keys(images)?.length
            }
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    padding: 16,
    paddingTop: 20,
    flexGrow: 1,
    backgroundColor: 'white',
    paddingBottom: 100,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    marginTop: 20,
  },
});

export default AddProduct;

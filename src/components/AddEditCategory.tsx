import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import CustomTextInput from './CustomTextInput';
import Colors from '../utils/colors';
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from '../store/services/product';
import CustomButton from './CustomButton';
import { CategoryModel } from '../store/services/types';

type AddEditCategoryProps = {
  isVisible: boolean;
  closeModal: () => any;
  selectedCategory: CategoryModel;
};

function AddEditCategory(props: AddEditCategoryProps): JSX.Element {
  const { isVisible, closeModal, selectedCategory } = props;
  const [categoryName, setCategoryName] = useState('');
  const [addNewCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (selectedCategory?.id) {
      setCategoryName(selectedCategory?.name);
    }
  }, [selectedCategory?.id, selectedCategory?.name]);

  const addCategory = async () => {
    setIsLoading(true);
    if (!categoryName?.trim()?.length) {
      setIsLoading(false);
      return;
    }
    if (selectedCategory?.id) {
      await updateCategory({ name: categoryName, id: selectedCategory?.id });
      Toast.show('Category updated successfully.', 2000);
      setIsLoading(false);
      closeModal();
    } else {
      await addNewCategory({ name: categoryName, isDisabled: false })
        .then(() => {
          setIsLoading(false);
          setCategoryName('');
          closeModal();
          Toast.show('Category added successfully.', 2000);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onPress={() => {
            setCategoryName('');
            closeModal();
          }}
          style={styles.closeButton}>
          <Ionicons color="white" name="close" size={20} />
        </TouchableOpacity>
        <CustomTextInput
          value={categoryName}
          placeholder="Category name"
          onChangeText={setCategoryName}
          onSubmitEditing={addCategory}
        />
        <CustomButton
          loading={isLoading}
          disabled={!categoryName}
          buttonText="Add"
          onPress={addCategory}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    borderRadius: 10,
  },
  closeButton: {
    padding: 8,
    backgroundColor: Colors.primaryDark,
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
});

export default AddEditCategory;

import * as React from 'react';
import { useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import AddEditCategory from '../components/AddEditCategory';
import CustomBack from '../components/CustomBack';
import Colors from '../utils/colors';
import GlobalStyles from '../utils/globalStyles';
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '../store/services/product';
import { capitalizeText } from '../utils/commonFunctions';

function ManageCategory(): JSX.Element {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [disableCategory] = useUpdateCategoryMutation();
  const { data: categoryData, isLoading: isCategoryLoading } =
    useGetCategoriesQuery<any>('');

  const onEdit = (item: any) => {
    setSelectedCategory(item);
    setModalVisible(true);
  };

  const disableSelectedCategory = (item: any) => {
    Alert.alert(
      item?.isDisabled ? 'Enabling category' : 'Disabling category?',
      `Are you sure you want to ${
        item?.isDisabled ? 'enable' : 'disable'
      } this category? The category as well as the products associated with it will ${
        item?.isDisabled ? 'now' : 'no longer'
      } be available to users.`,
      [
        { text: 'Cancel' },
        {
          text: item?.isDisabled ? 'Enable' : 'Disable',
          onPress: async () => {
            await disableCategory({ ...item, isDisabled: !item?.isDisabled });
            Toast.show(
              `Category ${
                item?.isDisabled ? 'enabled' : 'disabled'
              } successfully!`,
              2000
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {isCategoryLoading ? (
        <View style={[{ flex: 1 }, GlobalStyles.flexRow]}>
          <ActivityIndicator color={Colors.primaryDark} size={40} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <CustomBack />
            <Text style={[styles.welcomeText, { width: '70%' }]}>
              Manage category
            </Text>
          </View>
          <FlatList
            data={categoryData}
            extraData={categoryData}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <View style={styles.cardContainer}>
                <Text style={styles.categoryNameText}>
                  {capitalizeText(item.name)}
                </Text>
                <TouchableOpacity onPress={() => onEdit(item)}>
                  <MaterialIcons
                    style={styles.iconContainer}
                    name="mode-edit-outline"
                    size={24}
                    color="green"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    disableSelectedCategory(item);
                  }}>
                  <Ionicons
                    name={item?.isDisabled ? 'eye' : 'eye-off'}
                    color={item?.isDisabled ? 'orange' : 'red'}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={[GlobalStyles.textCenter, styles.noProductText]}>
                No categoried added!
              </Text>
            }
            style={styles.listStyle}
            contentContainerStyle={styles.listContentContainer}
          />

          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={() => setModalVisible(true)}>
              <Entypo name="plus" color="white" size={30} />
            </TouchableOpacity>
          </View>
          <View style={GlobalStyles.p16}>
            <AddEditCategory
              selectedCategory={selectedCategory}
              isVisible={isModalVisible}
              closeModal={() => {
                setSelectedCategory({});
                setModalVisible(false);
              }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: '900',
    color: 'white',
    flexGrow: 1,
    textAlign: 'center',
    marginRight: '12%',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: Colors.primaryBg,
    padding: 16,
  },
  contentContainer: {
    padding: 16,
    position: 'absolute',
    bottom: 170,
    right: 10,
  },
  noProductText: { marginTop: '50%', fontSize: 16, color: Colors.primaryDark },
  cardContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    textAlign: 'center',
  },
  listStyle: {
    flexGrow: 1,
    zIndex: 200,
    paddingHorizontal: 16,
  },
  listContentContainer: {
    paddingBottom: 250,
  },
  categoryNameText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.primaryDark,
    width: '75%',
    marginRight: 8,
  },
  addButtonContainer: {
    backgroundColor: Colors.orange,
    padding: 15,
    borderRadius: 40,
    elevation: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 20,
  },
});

export default ManageCategory;

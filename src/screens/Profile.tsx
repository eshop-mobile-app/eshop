import * as React from 'react';
import auth from '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  Text,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../utils/globalStyles';
import Colors from '../utils/colors';
import { useGetCurrentUserQuery } from '../store/services/user';
import { capitalizeText } from '../utils/commonFunctions';
import CustomButton from '../components/CustomButton';

function Profile(): JSX.Element {
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.user.userId);
  const { data } = useGetCurrentUserQuery<any>(userId);
  const logout = () => {
    Alert.alert('Are you sure?', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          await auth()
            .signOut()
            .then(() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'TabNavigator',
                    state: {
                      routes: [
                        {
                          name: 'HomeTab',
                          state: {
                            routes: [{ name: 'Home' }],
                          },
                        },
                      ],
                    },
                  },
                ],
              });
              dispatch({ type: 'USER_LOGOUT' });
            });
        },
      },
    ]);
  };
  const navigation = useNavigation<any>();
  const goToOrderHistory = () => {
    navigation.navigate('YourOrders');
  };

  const settingsOptions = [
    {
      role: ['customer', 'seller'],
      title: 'Your Orders',
      onPress: goToOrderHistory,
      icon: (
        <Octicons
          name="history"
          size={20}
          color={Colors.primaryDark}
          style={{ textAlign: 'left', marginRight: 16 }}
        />
      ),
    },
    {
      title: 'Logout',
      onPress: logout,
      icon: (
        <AntDesign
          name="logout"
          size={20}
          color={Colors.primaryDark}
          style={{ textAlign: 'left', marginRight: 16 }}
        />
      ),
    },
  ];

  return (
    <SafeAreaView>
      <StatusBar animated backgroundColor={Colors.primaryBg} />
      <View
        style={[
          styles.topContainer,
          GlobalStyles.flexRow,
          { justifyContent: data?.id ? 'flex-start' : 'center' },
        ]}>
        <View style={styles.profileImageContainer}>
          <FontAwesome
            name="user"
            color={Colors.primaryDark}
            size={40}
            style={{ textAlign: 'center' }}
          />
        </View>
        {data?.id ? (
          <View style={{ width: '70%' }}>
            <Text style={styles.nameText}>{capitalizeText(data?.name)}</Text>
            <Text style={styles.infoText}>{data?.email}</Text>
          </View>
        ) : null}
      </View>
      {data?.id ? (
        settingsOptions?.map((item: any) =>
          !item?.role || item?.role?.includes(data?.role) ? (
            <TouchableOpacity
              key={item.title}
              onPress={item.onPress}
              style={styles.menuOptionContainer}>
              <View>{item.icon}</View>
              <Text style={styles.menuOptionText}>{item.title}</Text>
            </TouchableOpacity>
          ) : null
        )
      ) : (
        <View style={styles.loginContainer}>
          <Text style={[styles.menuOptionText, { marginBottom: 20 }]}>
            Login to use additional features
          </Text>
          <CustomButton
            onPress={() => navigation.navigate('Login')}
            buttonStyle={{ width: '50%' }}
            buttonText="Login"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 25,
    fontWeight: '900',
    color: 'white',
    width: '70%',
  },
  topContainer: {
    backgroundColor: Colors.primaryBg,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 25,
  },
  profileImageContainer: {
    height: 90,
    width: 90,
    borderRadius: 50,
    marginRight: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '600',
  },
  infoText: {
    fontSize: 18,
    color: 'white',
  },
  menuOptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuOptionText: {
    fontSize: 18,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  loginContainer: {
    marginTop: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
});

export default Profile;

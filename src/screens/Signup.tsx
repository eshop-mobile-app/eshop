import * as React from 'react';
import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import GlobalStyles from '../utils/globalStyles';
import AuthContainer from '../components/AuthContainer';
import passwordRegex from '../utils/validations';
import BuyerBg from '../assets/images/buyer.jpeg';
import SellerBg from '../assets/images/seller.jpeg';
import { useCreateUserMutation } from '../store/services/user';

type SignupScreenProp = StackNavigationProp<any, 'Home'>;
interface Error {
  name?: string;
  businessName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function Signup(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [role, setRole] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [errors, setErrors] = useState<Error>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const businessNameFieldRef: any = useRef();
  const emailFieldRef: any = useRef();
  const passwordFieldRef: any = useRef();
  const confirmPasswordFieldRef: any = useRef();
  const navigation = useNavigation<SignupScreenProp>();
  const isButtonDisabled =
    !userData?.email ||
    !userData.name ||
    !userData?.password ||
    !userData?.confirmPassword;

  const updateUserData = (key: any, value: any) => {
    setUserData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const [createNewUser] = useCreateUserMutation();

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const createUser = () => {
    setErrors({});
    const formErrors: Error = {};
    if (!/\S+@\S+\.\S+/.test(userData?.email)) {
      formErrors.email = 'Please enter a valid email';
    }
    if (!passwordRegex.test(userData?.password)) {
      formErrors.password =
        'Password must be at least 8 digit, one uppercase letter, one lowercase letter, one number and one special character';
    }
    if (userData?.password !== userData?.confirmPassword) {
      formErrors.confirmPassword = 'Passwords must match';
    }
    const isFormValid = !Object.keys(formErrors)?.length;
    setErrors(formErrors);
    if (!isFormValid) {
      return;
    }
    if (isFormValid) {
      setIsLoading(true);
      auth()
        .createUserWithEmailAndPassword(
          userData.email?.toLowerCase(),
          userData.password
        )
        .then(async (response: any) => {
          const currentUserId = response.user.uid;
          await auth()?.currentUser?.updateProfile({
            displayName: userData.name,
          });

          const userDetails: any = {
            name: userData.name,
            email: userData.email,
            id: currentUserId,
            role,
          };
          if (role === 'seller') {
            userDetails.businessName = businessName;
          }
          const res = await createNewUser(userDetails);
          if (res) {
            Toast.show('User signed up successfully.', 2000);
            setIsLoading(false);
          } else {
            Alert.alert("Something wen't wrong");
          }
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('The entered email address is already in use!');
          } else if (error.code === 'auth/invalid-email') {
            Alert.alert('That email address is invalid!');
          } else {
            const errorMessage: string = error?.message?.includes(']')
              ? error.message.split(']')[1]
              : error.message;
            Alert.alert(errorMessage);
          }
          setIsLoading(false);
        });
    }
  };

  const resetFields = () => {
    setRole('');
    setUserData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setBusinessName('');
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraHeight={200}>
      <View style={{ flex: 1 }}>
        <AuthContainer showBack={!!role} onPressBack={resetFields}>
          <Text style={GlobalStyles.authMainText}>
            {role ? 'Sign up' : 'Sign up as'}
          </Text>
          {role ? (
            <>
              <CustomTextInput
                onChangeText={(text: string) => updateUserData('name', text)}
                value={userData.name}
                placeholder="Full Name"
                error={errors?.name}
                onSubmitEditing={() => {
                  (role === 'seller'
                    ? businessNameFieldRef
                    : emailFieldRef
                  )?.current?.focus();
                }}
                blurOnSubmit={false}
              />
              {role === 'seller' ? (
                <CustomTextInput
                  onChangeText={setBusinessName}
                  value={businessName}
                  placeholder="Business Name"
                  error={errors?.businessName}
                  inputRef={businessNameFieldRef}
                  onSubmitEditing={() => {
                    emailFieldRef?.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              ) : null}
              <CustomTextInput
                onChangeText={(text: string) => updateUserData('email', text)}
                value={userData.email}
                placeholder="Email Address"
                error={errors?.email}
                inputRef={emailFieldRef}
                onSubmitEditing={() => {
                  passwordFieldRef?.current?.focus();
                }}
                blurOnSubmit={false}
                keyboardType="email-address"
              />
              <CustomTextInput
                onChangeText={(text: string) =>
                  updateUserData('password', text)
                }
                placeholder="Password"
                value={userData.password}
                error={errors?.password}
                fieldType="password"
                inputRef={passwordFieldRef}
                onSubmitEditing={() => {
                  confirmPasswordFieldRef?.current?.focus();
                }}
                blurOnSubmit={false}
              />
              <CustomTextInput
                placeholder="Confirm Password"
                onChangeText={(text: string) =>
                  updateUserData('confirmPassword', text)
                }
                value={userData.confirmPassword}
                error={errors?.confirmPassword}
                fieldType="password"
                inputRef={confirmPasswordFieldRef}
                onSubmitEditing={createUser}
              />
              <View style={{ marginTop: Object.keys(errors)?.length ? 10 : 0 }}>
                <CustomButton
                  loading={isLoading}
                  disabled={isButtonDisabled}
                  buttonText="Sign up"
                  onPress={createUser}
                />
              </View>
              <View style={[GlobalStyles.flexRow, GlobalStyles.mt20]}>
                <Text style={GlobalStyles.descText}>
                  Already have an account{' '}
                </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text style={GlobalStyles.highlightedText}>Log in</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.roleContainer}
                onPress={() => setRole('customer')}>
                <ImageBackground
                  source={BuyerBg}
                  resizeMode="cover"
                  style={styles.roleImageContainer}>
                  <View style={styles.overlay} />
                  <Text style={styles.roleText}>Customer</Text>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleContainer,
                  GlobalStyles.mt20,
                  GlobalStyles.mb30,
                ]}
                onPress={() => setRole('seller')}>
                <ImageBackground
                  source={SellerBg}
                  resizeMode="cover"
                  style={styles.roleImageContainer}>
                  <View style={styles.overlay} />
                  <Text style={styles.roleText}>Seller</Text>
                </ImageBackground>
              </TouchableOpacity>
            </>
          )}
        </AuthContainer>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  roleContainer: {
    height: '30%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  roleImageContainer: {
    height: '100%',
    width: '100%',
    overlayColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    position: 'absolute',
    color: 'white',
    fontSize: 25,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default Signup;

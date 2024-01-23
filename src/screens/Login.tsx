import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import GlobalStyles from '../utils/globalStyles';
// import CustomDivider from '../components/CustomDivider';
// import GoogleIcon from '../assets/images/google.png';
// import FacebookIcon from '../assets/images/facebook.png';
import AuthContainer from '../components/AuthContainer';
import passwordRegex from '../utils/validations';
import { useGetCurrentUserQuery } from '../store/services/user';

type LoginScreenProp = StackNavigationProp<any, 'Home'>;

interface Error {
  email?: string;
  password?: string;
}

function Login(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const passwordFieldRef: any = useRef();
  const [userId, setUserId] = useState('');
  const {
    data,
    isLoading: userLoading,
    isSuccess,
  } = useGetCurrentUserQuery<any>(userId, {
    skip: !userId,
  });
  const [errors, setErrors] = useState<Error>({
    email: '',
    password: '',
  });
  const navigateToSignup = () => {
    reset();
    navigation.navigate('Signup');
  };
  const navigateToForgotPassword = () => {
    reset();
    navigation.navigate('ForgotPassword');
  };

  useEffect(() => {
    if (!userLoading && isSuccess) {
      const userRole = data?.role;
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
                    routes: [
                      {
                        name:
                          userRole === 'customer' ? 'Home' : 'SellerDashboard',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      });
      setIsLoading(false);
    }
  }, [userLoading, isSuccess, data, navigation]);

  const reset = () => {
    setErrors({});
    setEmail('');
    setPassword('');
  };

  useEffect(
    () => () => {
      reset();
    },
    []
  );

  const loginUser = () => {
    setErrors({});
    const formErrors: Error = {};
    if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Please enter a valid email';
    }
    if (!passwordRegex.test(password)) {
      formErrors.password =
        'Password must be at least 8 digit, one uppercase letter, one lowercase letter, one number and one special character';
    }
    const isFormValid = !Object.keys(formErrors)?.length;
    setErrors(formErrors);
    if (!isFormValid) {
      return;
    }
    if (isFormValid) {
      setIsLoading(true);
      auth()
        .signInWithEmailAndPassword(email?.toLowerCase(), password)
        .then(res => {
          setUserId(res?.user?.uid);
        })
        .catch((error: any) => {
          const errorCode = error.code;
          if (
            errorCode === 'auth/invalid-login' ||
            errorCode === 'auth/invalid-credential'
          ) {
            Alert.alert('Please enter valid credentials.');
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

  return (
    <AuthContainer showBack>
      <Text style={GlobalStyles.authMainText}>Log in</Text>
      <CustomTextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Email Address"
        error={errors?.email}
        onSubmitEditing={() => {
          passwordFieldRef?.current?.focus();
        }}
        keyboardType="email-address"
        blurOnSubmit={false}
      />
      <CustomTextInput
        inputRef={passwordFieldRef}
        onChangeText={setPassword}
        placeholder="Password"
        value={password}
        error={errors?.password}
        fieldType="password"
        onSubmitEditing={loginUser}
      />
      <TouchableOpacity
        onPress={navigateToForgotPassword}
        style={[
          !errors?.password && styles.mtMinus15,
          {
            alignSelf: 'flex-end',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          },
        ]}>
        <Text style={[GlobalStyles.subDescText, styles.textRight]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <CustomButton
        loading={isLoading}
        buttonText="Log in"
        onPress={loginUser}
        disabled={!email || !password}
      />
      <View style={[GlobalStyles.flexRow, GlobalStyles.mt20]}>
        <Text style={GlobalStyles.descText}>Don't have an account? </Text>
        <TouchableOpacity onPress={navigateToSignup}>
          <Text style={GlobalStyles.highlightedText}>Sign up</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={[GlobalStyles.flexRow, styles.dividerContainer]}>
        <CustomDivider style={{ marginTop: 5 }} />
        <Text style={styles.orText}>or</Text>
        <CustomDivider style={{ marginTop: 5 }} />
      </View> */}
      {/* <View style={GlobalStyles.flexRow}>
        <View style={[styles.logoContainer, styles.mr20]}>
          <Image style={styles.loginLogo} source={GoogleIcon} />
        </View>
        <View style={styles.logoContainer}>
          <Image style={styles.loginLogo} source={FacebookIcon} />
        </View>
      </View> */}
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  loginLogo: {
    height: 30,
    width: 30,
  },
  orText: {
    fontSize: 19,
    fontWeight: '600',
    color: 'grey',
    marginHorizontal: 10,
  },
  dividerContainer: {
    paddingVertical: '12%',
    overflow: 'hidden',
  },
  logoContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mr20: {
    marginRight: 20,
  },
  textRight: {
    textAlign: 'left',
    marginBottom: 15,
  },
  mtMinus15: {
    marginTop: -15,
  },
});

export default Login;

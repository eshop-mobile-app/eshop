import * as React from 'react';
import { useState } from 'react';
import { Alert, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import GlobalStyles from '../utils/globalStyles';
import AuthContainer from '../components/AuthContainer';

function ForgotPassword(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string>('');
  const navigation = useNavigation();

  const sendResetMail = () => {
    setErrors('');
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors('Please enter a valid email');
      return;
    }
    setIsLoading(true);
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setIsLoading(false);
        Alert.alert(
          'Email send successfully!',
          'A password reset mail has been sent to the entered email. Please check the mail for further instructions.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      })
      .catch(error => {
        const errorCode = error.code;
        if (errorCode === 'auth/user-not-found') {
          Alert.alert('Email not registered');
        } else {
          const errorMessage: string = error?.message?.includes(']')
            ? error.message.split(']')[1]
            : error.message;
          Alert.alert(errorMessage);
        }
        setIsLoading(false);
      });
  };

  return (
    <AuthContainer showBack>
      <Text style={GlobalStyles.authMainText}>Forgot Password?</Text>
      <Text style={[GlobalStyles.descText, GlobalStyles.mb30]}>
        Enter email address to get a reset link
      </Text>
      <CustomTextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Email Address"
        error={errors}
        keyboardType="email-address"
        onSubmitEditing={sendResetMail}
      />
      <CustomButton
        loading={isLoading}
        buttonText="Send"
        onPress={sendResetMail}
        disabled={!email}
      />
    </AuthContainer>
  );
}

export default ForgotPassword;

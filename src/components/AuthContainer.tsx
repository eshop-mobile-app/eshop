import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../utils/colors';
import Logo from '../assets/images/logo.png';
import CustomBack from './CustomBack';

type ForgotPasswordScreenProp = StackNavigationProp<any, 'Home'>;

type AuthContainerProps = {
  children: React.ReactNode;
  showBack: boolean;
  onPressBack: () => any;
};

function AuthContainer(props: AuthContainerProps): JSX.Element {
  const navigation = useNavigation<ForgotPasswordScreenProp>();
  const { children, showBack, onPressBack } = props;
  const goBack = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar animated backgroundColor={Colors.logoBg} />
      <View style={styles.topContainer}>
        <Image source={Logo} style={styles.bgImg} resizeMode="cover" />
        {showBack ? (
          <View
            style={{
              position: 'absolute',
              top: Platform.OS === 'ios' ? 60 : 20,
              left: 20,
            }}>
            <CustomBack onPress={goBack} />
          </View>
        ) : null}
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.bottomContainer}
        contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.pv50}>{children}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImg: {
    height: 120,
    width: 120,
    marginBottom: '10%',
  },
  mainContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  topContainer: {
    backgroundColor: Colors.logoBg,
    height: '35%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  bottomContainer: {
    backgroundColor: 'white',
    marginTop: '-10%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    height: '65%',
  },
  pv50: {
    paddingVertical: 50,
  },
});

export default AuthContainer;

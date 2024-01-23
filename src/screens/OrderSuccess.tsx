import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import CustomButton from '../components/CustomButton';
import Colors from '../utils/colors';
import GlobalStyles from '../utils/globalStyles';
import { clearCart } from '../store/functions';

type OrderSuccessProps = {
  route: any;
};

function OrderSuccess({ route }: OrderSuccessProps): JSX.Element {
  const navigation: any = useNavigation();
  const orderData = route.params?.orderData;

  const clearCartData = () => {
    clearCart();
  };

  useEffect(() => {
    clearCartData();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.topContainer} />
      <View style={styles.mainContainer}>
        <LottieView
          style={{ height: 200, width: 200 }}
          source={require('../assets/lottieAnimations/order_placed.json')}
          autoPlay
          loop={false}
        />
        <Text style={styles.congratsText}>Congratulations!</Text>
        <Text style={styles.placedText}>
          Your order has been successfully placed.
        </Text>
        <View
          style={[
            GlobalStyles.rowBetween,
            { width: '100%', paddingHorizontal: 16 },
          ]}
        >
          <View style={styles.buttonContainer}>
            <CustomButton
              buttonText="Go to home"
              onPress={() => navigation.popToTop()}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              buttonText="View details"
              onPress={() => {
                navigation.reset({
                  index: 1,
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
                    {
                      name: 'OrderDetails',
                      params: { orderData },
                    },
                  ],
                });
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -120,
  },
  congratsText: {
    fontSize: 30,
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  placedText: {
    fontSize: 18,
    color: Colors.primaryDark,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 30,
  },
  buttonContainer: {
    width: '49%',
  },
  topContainer: {
    backgroundColor: Colors.primaryBg,
    height: '40%',
    width: '100%',
    padding: 20,
  },
});

export default OrderSuccess;

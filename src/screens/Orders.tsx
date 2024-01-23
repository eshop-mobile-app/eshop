import * as React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

function Orders(): JSX.Element {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={{ color: 'black' }}>Orders</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Orders;

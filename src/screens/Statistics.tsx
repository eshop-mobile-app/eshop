import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
// import SalesChart from '../components/charts/SalesChart';
import Colors from '../utils/colors';
import CustomBack from '../components/CustomBack';
import GlobalStyles from '../utils/globalStyles';
import MostOrderedProductsChart from '../components/charts/MostOrderedProductsChart';
import BestRatedProducts from '../components/charts/BestRatedProducts';

function Statistics() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={[styles.header, GlobalStyles.p16]}>
        <CustomBack />
        <Text style={[styles.welcomeText, { width: '70%' }]}>Statistics</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
        }}
        style={{
          marginBottom: 155,
        }}>
        {/* <SalesChart /> */}
        <BestRatedProducts />
        <MostOrderedProductsChart />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    backgroundColor: Colors.primaryBg,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: '900',
    color: 'white',
    flexGrow: 1,
    textAlign: 'center',
    marginRight: '12%',
  },
});

export default Statistics;

import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { PieChart } from 'react-native-chart-kit';
import { useGetCurrentUserQuery } from '../../store/services/user';
import Colors from '../../utils/colors';

import GlobalStyles from '../../utils/globalStyles';
import { pieChartColors } from '../../utils/constants';
import { useGetSellerOrdersQuery } from '../../store/services/order';

function MostOrderedProductsChart(): JSX.Element {
  const userId = useSelector((state: any) => state.user.userId);
  const { data, isLoading: userLoading } = useGetCurrentUserQuery<any>(userId);

  const [pieChartData, setPieChartData] = React.useState([]);
  const { data: sellerOrders, isLoading: sellerOrdersLoading } =
    useGetSellerOrdersQuery<any>({
      isAdmin: data?.role === 'admin',
    });

  React.useEffect(() => {
    const productsCount: any = {};
    const allProducts: any = [];
    sellerOrders?.forEach((item: any) => allProducts.push(...item.productData));
    allProducts?.forEach((element: any) => {
      if (productsCount[element?.id]) {
        productsCount[element?.id].totalOrderedQuantity =
          Number(productsCount[element?.id].totalOrderedQuantity) +
          Number(element.orderedQuantity);
      } else {
        productsCount[element?.id] = {
          ...element,
          totalOrderedQuantity: element.orderedQuantity,
        };
      }
    });
    let finalProductData = Object.values(productsCount);
    finalProductData.sort(
      (a: any, b: any) => b.totalOrderedQuantity - a.totalOrderedQuantity
    );
    finalProductData = finalProductData.slice(0, 5);

    const pieData: any = finalProductData.map((item: any, index: number) => ({
      name: item?.name,
      totalOrderedQuantity: item.totalOrderedQuantity,
      color: pieChartColors[index],
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));
    setPieChartData(pieData);
  }, [sellerOrders]);

  return userLoading || sellerOrdersLoading ? (
    <View style={[{ flex: 1 }, GlobalStyles.flexRow]}>
      <ActivityIndicator color={Colors.primaryDark} size={40} />
    </View>
  ) : pieChartData?.length ? (
    <View style={[styles.mainContainer, { backgroundColor: '#F3EAE0' }]}>
      <View style={[GlobalStyles.p16, { paddingBottom: 0 }]}>
        <Text style={styles.chartTitle}>Most ordered products</Text>
      </View>
      <View style={styles.mainChartContainer}>
        <PieChart
          data={pieChartData}
          width={Dimensions.get('screen').width - 60}
          height={220}
          chartConfig={{
            color: () => Colors.primaryDark,
          }}
          accessor="totalOrderedQuantity"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={false}
        />
        <View style={styles.allLegendContainer}>
          {pieChartData?.map((item: any, index: number) => (
            <View
              key={item.name + item.totalOrderedQuantity}
              style={styles.legendContainer}>
              <View
                style={[
                  styles.legendColorContainer,
                  {
                    backgroundColor: pieChartColors[index],
                  },
                ]}
              />
              <Text style={styles.legendText} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  ) : (
    <View />
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primaryDark,
    textAlign: 'left',
  },
  legendText: {
    maxWidth: '85%',
    marginLeft: 6,
    fontWeight: '500',
    color: 'grey',
    marginTop: -4,
  },
  legendColorContainer: {
    height: 15,
    width: 15,
    borderRadius: 20,
  },
  legendContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  allLegendContainer: {
    position: 'absolute',
    right: 0,
    width: '35%',
    marginRight: 20,
  },
  mainChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MostOrderedProductsChart;

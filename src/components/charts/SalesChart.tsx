import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import { useGetCurrentUserQuery } from '../../store/services/user';
import Colors from '../../utils/colors';
import {
  groupDataIntoMonth,
  groupDataIntoMonthDates,
  groupDataIntoWeekDays,
} from '../../utils/commonFunctions';
import GlobalStyles from '../../utils/globalStyles';
import { revenueFilterOptions } from '../../utils/constants';
import { useGetSellerOrdersQuery } from '../../store/services/order';

function SalesChart(): JSX.Element {
  const actionSheetRef: any = React.useRef();
  const userId = useSelector((state: any) => state.user.userId);
  const { data, isLoading: userLoading } = useGetCurrentUserQuery<any>(userId);
  const [revenueFilter, setRevenueFilter] = React.useState('This week');

  const [chartData, setChartData] = React.useState<any[]>([]);
  const { data: sellerOrders, isLoading: sellerOrdersLoading } =
    useGetSellerOrdersQuery<any>({
      isAdmin: data?.role === 'admin',
      filter: revenueFilter,
    });

  const showActionSheet = () => {
    actionSheetRef.current.show();
  };

  React.useEffect(() => {
    let finalChartData = [];
    if (revenueFilter?.toLowerCase() === 'this year') {
      finalChartData = groupDataIntoMonth(sellerOrders || []);
    } else if (revenueFilter?.toLowerCase() === 'this month') {
      finalChartData = groupDataIntoMonthDates(sellerOrders || []);
    } else {
      finalChartData = groupDataIntoWeekDays(sellerOrders || []);
    }
    setChartData(finalChartData);
  }, [revenueFilter, sellerOrders]);

  const renderOptions: any =
    Platform.OS !== 'ios'
      ? [
          ...revenueFilterOptions?.map((item: any) => (
            <Text
              style={{
                color:
                  item?.toLowerCase() === revenueFilter?.toLowerCase()
                    ? Colors.primaryDark
                    : 'black',
                fontSize: 18,
                fontWeight: item === revenueFilter ? '600' : '400',
              }}>
              {item}
            </Text>
          )),
          'Cancel',
        ]
      : [...revenueFilterOptions, 'Cancel'];

  return (
    <>
      {userLoading || sellerOrdersLoading ? (
        <View style={[{ flex: 1 }, GlobalStyles.flexRow]}>
          <ActivityIndicator color={Colors.primaryDark} size={40} />
        </View>
      ) : (
        <View
          style={[
            styles.mainContainer,
            { backgroundColor: '#F3EAE0', marginBottom: 16 },
          ]}>
          <View style={[{ padding: 16 }, GlobalStyles.rowBetween]}>
            <Text style={styles.chartTitle}>Sales</Text>
            <TouchableOpacity
              onPress={showActionSheet}
              style={[styles.filterContainer, GlobalStyles.flexRow]}>
              <Text style={styles.revenueFilterText}>{revenueFilter}</Text>
              <FontAwesome5
                name="chevron-down"
                style={styles.downArrow}
                color={Colors.primaryDark}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            style={styles.scrollView}
            scrollEnabled={revenueFilter.toLowerCase() === 'this year'}>
            {Object.keys(chartData)?.length ? (
              <LineChart
                withInnerLines={false}
                data={{
                  labels: chartData.map((entry: any) => entry.x),
                  datasets: [
                    {
                      data: chartData.map((entry: any) => entry?.y),
                      strokeWidth: 2,
                    },
                  ],
                }}
                fromNumber={
                  chartData.map((entry: any) => entry?.y)?.length &&
                  Math.max(...chartData.map((entry: any) => entry?.y)) > 4
                    ? chartData.map((entry: any) => entry?.y)?.length
                    : 4
                }
                width={
                  Dimensions.get('screen').width +
                  (revenueFilter.toLowerCase() === 'this year' ? 180 : -60)
                }
                height={200}
                bezier
                chartConfig={{
                  backgroundColor: 'white',
                  backgroundGradientFrom: 'white',
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientTo: 'white',
                  backgroundGradientToOpacity: 0,
                  fillShadowGradientFrom: Colors.primaryDark,
                  fillShadowGradientTo: Colors.primaryDark,
                  decimalPlaces: 0,
                  color: () => Colors.primaryDark,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={styles.chartStyle}
              />
            ) : null}
          </ScrollView>
        </View>
      )}
      <ActionSheet
        ref={actionSheetRef}
        title="Select filter option"
        options={renderOptions}
        cancelButtonIndex={revenueFilterOptions?.length}
        destructiveButtonIndex={revenueFilterOptions?.length}
        onPress={(index: any) => {
          if (index !== revenueFilterOptions?.length) {
            setRevenueFilter(revenueFilterOptions[index]);
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    paddingBottom: 8,
  },
  mainContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primaryDark,
    textAlign: 'left',
  },
  downArrow: { marginTop: 4, marginLeft: 8 },
  revenueFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primaryDark,
  },
  chartStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 60,
  },
  filterContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
    backgroundColor: '#F3EAE0',
    borderRadius: 4,
    elevation: 5,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default SalesChart;

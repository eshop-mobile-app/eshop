import moment from 'moment';
import { check, Permission, RESULTS } from 'react-native-permissions';
import firestore from '@react-native-firebase/firestore';
import { chartMonth, chartWeek, chartYear } from './constants';
import { ChartDataModel, OrderModel } from '../store/services/types';

const checkPermission = (permission: Permission) => {
  check(permission)
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)'
          );
          return false;

        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable'
          );
          return false;

        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          return false;

        case RESULTS.GRANTED:
          console.log('The permission is granted');
          return true;

        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          return false;

        default:
          return false;
      }
    })
    .catch(error => {
      console.log({ error });

      // …
    });
};
const capitalizeText = (text: string) =>
  text ? text?.charAt(0).toUpperCase() + text.slice(1) : text;

function generateId(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export { checkPermission, capitalizeText, generateId };

export const formatSecondsToDate = (seconds: number) => {
  const date = moment(new Date(new Date(seconds * 1000))).format('DD/MM/YYYY');
  return date;
};

export const roundNumbers = (totalRevenue: number) => {
  let converted: string | number = totalRevenue;
  if (totalRevenue >= 10000000) {
    converted = `${(totalRevenue / 10000000)
      .toFixed(2)
      .replace(/\.?0+$/, '')}Cr`;
  } else if (totalRevenue >= 100000) {
    converted = `${(totalRevenue / 100000).toFixed(2).replace(/\.?0+$/, '')}L`;
  } else if (totalRevenue >= 1000) {
    converted = `${(totalRevenue / 1000).toFixed(2).replace(/\.?0+$/, '')}K`;
  }
  return converted;
};

export const groupDataIntoMonth = (data: OrderModel[]) => {
  const groupedData: ChartDataModel[] = [];
  chartYear?.forEach((item: string) => {
    const orderInMonth = data?.filter((order: OrderModel) => {
      const timestamp = order.orderDate;
      const date = formatSecondsToDate(timestamp?.seconds);
      const monthYearKey = moment(date, 'DD/MM/YYYY').format('MMM');
      return monthYearKey === item;
    });
    groupedData.push({ x: item, y: orderInMonth?.length });
  });
  return groupedData;
};

export const groupDataIntoMonthDates = (data: OrderModel[]) => {
  const groupedData: ChartDataModel[] = [];
  chartMonth?.forEach((item: string, index: number) => {
    const orderInMonth = data?.filter((order: OrderModel) => {
      const timestamp = order.orderDate;
      const date = formatSecondsToDate(timestamp?.seconds);
      if (index === 0) {
        return moment(date, 'DD/MM/YYYY').isSameOrBefore(
          moment(item, 'MMM DD')
        );
      }
      return (
        moment(date, 'DD/MM/YYYY').isSameOrBefore(moment(item, 'MMM DD')) &&
        moment(date, 'DD/MM/YYYY').isAfter(
          moment(chartMonth[index - 1], 'MMM DD')
        )
      );
    });

    groupedData.push({ x: item, y: orderInMonth?.length });
  });
  return groupedData?.length === 1 ? [0, groupedData] : groupedData;
};

export function getFirestoreDataByTimeRange(timeRange: string) {
  const currentDate = new Date();
  let startDate;
  let endDate;

  switch (timeRange) {
    case 'this week':
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - currentDate.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;

    case 'last week':
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - currentDate.getDay() - 7);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;

    case 'this month':
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'this year':
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(currentDate.getFullYear() + 1, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      break;

    default:
      throw new Error('Invalid time range specified');
  }

  const startTimestamp = firestore.Timestamp.fromDate(startDate);
  const endTimestamp = firestore.Timestamp.fromDate(endDate);
  return { startDate: startTimestamp, endDate: endTimestamp };
}

export const groupDataIntoWeekDays = (data: OrderModel[]) => {
  const orderCountArray: ChartDataModel[] = chartWeek.map((item: string) => ({
    x: item,
    y: 0,
  }));
  data?.forEach((doc: OrderModel) => {
    const timestamp = doc.orderDate;
    const date = formatSecondsToDate(timestamp?.seconds);
    const orderDate = moment(date, 'DD/MM/YYYY');

    const dayIndex = orderDate.day(); // 0 for Sunday, 1 for Monday, and so on
    orderCountArray[dayIndex].y += 1;
  });

  return orderCountArray;
};

export const average = (array: number[]) => {
  const sum = array.reduce((a, b) => Number(a) + Number(b));
  return (sum / array.length).toFixed(1);
};

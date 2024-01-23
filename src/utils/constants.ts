import moment from 'moment';

export const currencyUnit = '₹';

export const chartYear = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export const chartWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const revenueFilterOptions: string[] = [
  'This Year',
  'This Month',
  'Last week',
  'This week',
];

export const chartMonth: string[] = [
  `${moment(new Date()).format('MMM')} 7`,
  `${moment(new Date()).format('MMM')} 14`,
  `${moment(new Date()).format('MMM')} 21`,
  `${moment(new Date()).format('MMM')} 28`,
];

export const pieChartColors = [
  '#44A1BC',
  '#4D61C6',
  '#E26335',
  '#E79C23',
  '#5FB45F',
];

import { Platform, TextStyle, ViewStyle } from 'react-native';
import Colors from './colors';

type GlobalStyleType = {
  authMainText: TextStyle;
  ph16: ViewStyle;
  p16: ViewStyle;
  rowBetween: ViewStyle;
  flexRow: ViewStyle;
  mt20: ViewStyle;
  descText: TextStyle;
  highlightedText: TextStyle;
  mb15: ViewStyle;
  mb20: ViewStyle;
  mb30: ViewStyle;
  subDescText: TextStyle;
  w100: ViewStyle;
  textCenter: TextStyle;
};

const GlobalStyles: GlobalStyleType = {
  authMainText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: '10%',
  },
  ph16: {
    paddingHorizontal: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  p16: {
    padding: 16,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mt20: {
    marginTop: 20,
  },
  descText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'grey',
  },
  highlightedText: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '700' : '900',
    color: Colors.orange,
  },
  mb15: { marginBottom: 15 },
  mb20: { marginBottom: 20 },
  mb30: { marginBottom: 30 },
  subDescText: {
    fontSize: 14,
    color: 'grey',
    fontWeight: '600',
  },
  w100: {
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
};

export default GlobalStyles;

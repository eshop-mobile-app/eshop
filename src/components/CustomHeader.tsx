import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomBack from './CustomBack';
import Colors from '../utils/colors';

function CustomHeader(props: any) {
  const { title, showBack } = props;

  return (
    <View style={styles.mainContainer}>
      {showBack ? (
        <CustomBack style={{ height: 40, width: 40, marginRight: 16 }} />
      ) : null}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.primaryBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default CustomHeader;

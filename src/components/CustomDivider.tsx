import * as React from 'react';
import { StyleSheet, View } from 'react-native';

function CustomDivider(props: any): JSX.Element {
  return <View {...props} style={[styles.dividerStyle, props.style]} />;
}

const styles = StyleSheet.create({
  dividerStyle: {
    width: '100%',
    height: 1,
    backgroundColor: 'lightgrey',
  },
});

export default CustomDivider;

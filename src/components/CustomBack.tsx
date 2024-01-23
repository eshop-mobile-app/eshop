import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../utils/colors';

function CustomBack(props: any): JSX.Element {
  const { onPress, style = {} } = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          navigation.goBack();
        }
      }}
      style={[styles.buttonContainer, style]}>
      <Ionicons
        name="chevron-back"
        color={Colors.primaryDark}
        size={32}
        style={{ marginRight: 3 }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgOpaqueBrown,
    borderRadius: 50,
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default CustomBack;

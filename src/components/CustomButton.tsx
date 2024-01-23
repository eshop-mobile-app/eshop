import * as React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Colors from '../utils/colors';

function CustomButton(props: any): JSX.Element {
  const { buttonText, onPress, disabled, loading, children, buttonStyle } =
    props;
  return (
    <TouchableOpacity
      style={
        disabled
          ? styles.disabledButtonContainer
          : [styles.buttonContainer, buttonStyle]
      }
      onPress={onPress}
      disabled={disabled}
    >
      {!loading ? (
        children || <Text style={styles.buttonText}>{buttonText}</Text>
      ) : (
        <ActivityIndicator color="white" size={28} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.orange,
    borderRadius: 50,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
    width: '100%',
  },
  disabledButtonContainer: {
    backgroundColor: Colors.opaquePrimary,
    borderRadius: 50,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CustomButton;

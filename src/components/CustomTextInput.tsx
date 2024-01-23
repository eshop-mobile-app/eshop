import * as React from 'react';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../utils/globalStyles';
import Colors from '../utils/colors';

function CustomTextInput(props: any): JSX.Element {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View>
      <View
        style={[
          GlobalStyles.rowBetween,
          styles.inputContainer,
          !props?.error && GlobalStyles.mb20,
        ]}
      >
        <TextInput
          ref={props?.inputRef}
          {...props}
          style={[{ flexGrow: 1 }, styles.inputStyle]}
          placeholderTextColor="#BDBEBF"
          secureTextEntry={
            props?.fieldType === 'password' && !isPasswordVisible
          }
          returnKeyType="next"
        />
        {props?.fieldType === 'password' ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(prevState => !prevState)}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              color="grey"
              size={25}
            />
          </TouchableOpacity>
        ) : props?.rightIcon ? (
          <TouchableOpacity>{props?.rightIcon}</TouchableOpacity>
        ) : null}
      </View>
      {props?.error ? (
        <Text style={styles.errorText}>{props?.error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    paddingHorizontal: 20,
    height: 50,
  },
  inputStyle: {
    fontSize: 17,
    color: 'black',
    fontWeight: '400',
  },
  errorText: {
    color: Colors.red,
    marginHorizontal: 18,
    fontWeight: '500',
  },
});

export default CustomTextInput;

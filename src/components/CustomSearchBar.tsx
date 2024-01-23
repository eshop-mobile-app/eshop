import * as React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../utils/colors';

function CustomSearchBar(props: any) {
  const { onClear, onChangeText, ...rest } = props;
  const textInput = React.useRef<any>(null);
  return (
    <View style={styles.searchSection}>
      <Feather
        style={styles.searchIcon}
        name="search"
        size={20}
        color={Colors.primaryDark}
      />
      <TextInput
        ref={textInput}
        style={styles.input}
        placeholder="Search"
        placeholderTextColor={Colors.primaryDark}
        underlineColorAndroid="transparent"
        onChangeText={text => onChangeText(text?.trim())}
        {...rest}
      />
      <TouchableOpacity
        onPress={() => {
          textInput.current.clear();
          onClear();
        }}>
        <Entypo
          name="cross"
          size={22}
          color={Colors.primaryDark}
          style={{ marginRight: 4 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgOpaqueBrown,
    width: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    height: 46,
    paddingHorizontal: 6,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#E3CDBF',
    color: '#424242',
    fontSize: 16,
  },
});

export default CustomSearchBar;

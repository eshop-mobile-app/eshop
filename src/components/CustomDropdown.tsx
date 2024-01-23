import * as React from 'react';
import { useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ActionSheet from 'react-native-actionsheet';
import Colors from '../utils/colors';
import { capitalizeText } from '../utils/commonFunctions';

function CustomDropdown(props: any): JSX.Element {
  const actionSheetRef: any = useRef();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const { options, placeholder, selectedCategory, onSelect } = props;
  const showActionSheet = () => {
    setIsActionSheetVisible(true);
    actionSheetRef.current.show();
  };

  return (
    <View>
      <TouchableOpacity onPress={showActionSheet} style={styles.inputStyle}>
        <Text
          style={[
            selectedCategory
              ? styles.selectedValueText
              : styles.placeholderStyle,
            { width: '90%' },
          ]}
          numberOfLines={1}
        >
          {capitalizeText(selectedCategory || placeholder)}
        </Text>
        <FontAwesome5
          name={isActionSheetVisible ? 'chevron-up' : 'chevron-down'}
          style={styles.placeholderStyle}
        />
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        title="Select product category"
        options={
          Platform.OS === 'ios'
            ? [...options, 'Cancel']
            : [
              ...options?.map((item: any) => (
                <Text
                  style={{
                    color:
                        item?.toLowerCase() === selectedCategory?.toLowerCase()
                          ? Colors.orange
                          : 'black',
                    fontSize: 18,
                    fontWeight: item === selectedCategory ? '600' : '400',
                  }}
                >
                  {item}
                </Text>
              )),
              'Cancel',
            ]
        }
        cancelButtonIndex={options?.length}
        destructiveButtonIndex={options?.length}
        onPress={(index: any) => {
          setIsActionSheetVisible(false);
          onSelect(index);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    paddingHorizontal: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  placeholderStyle: {
    color: '#BDBEBF',
    fontSize: 17,
    fontWeight: '500',
  },
  selectedValueText: {
    color: 'black',
    fontSize: 17,
    fontWeight: '400',
  },
});

export default CustomDropdown;

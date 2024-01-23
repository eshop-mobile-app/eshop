import * as React from 'react';
import { useRef } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker/src';
import { PERMISSIONS, request } from 'react-native-permissions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { checkPermission } from '../utils/commonFunctions';
import Colors from '../utils/colors';

function CustomImagePicker(props: any) {
  const { onSelectImage, selectedImages } = props;

  const openImagePicker = async () => {
    const isPermissionAdded: any = checkPermission(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.IOS.PHOTO_LIBRARY
    );
    if (isPermissionAdded) {
      await pickImage();
    } else {
      await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY
      ).then(async res => {
        if (res === 'granted') {
          await pickImage();
        }
      });
    }
  };

  const pickImage = async () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    await launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('Image picker error: ', response.error);
      } else {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        onSelectImage((prevState: string[]) => [...prevState, imageUri]);
      }
    });
  };

  const takePicture = async () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    await launchCamera(options, (response: any) => {
      if (!response.didCancel && !response.error) {
        const imageUri = response.uri || response.assets?.[0]?.uri;
        onSelectImage((prevState: string[]) => [...prevState, imageUri]);
      }
    });
  };

  const handleCameraLaunch = async () => {
    const isPermissionAdded: any = checkPermission(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA
    );
    if (isPermissionAdded) {
      await takePicture();
    } else {
      await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA
      ).then(async res => {
        if (res === 'granted') {
          await takePicture();
        }
      });
    }
  };

  const actionSheetRef: any = useRef();

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        horizontal
        style={{ width: '100%' }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flexDirection: 'row', marginRight: 20 }}>
          <TouchableOpacity
            style={styles.takeImageContainer}
            onPress={() => {
              actionSheetRef.current.show();
            }}
          >
            <FontAwesome
              style={styles.textCenter}
              name="image"
              color="#BDBEBF"
              size={22}
            />
            <Text style={styles.addImageText}>Add image</Text>
          </TouchableOpacity>
          {selectedImages &&
            selectedImages?.map((item: string, index: any) => (
              <View key={item + index.toString()}>
                <TouchableOpacity
                  onPress={() => {
                    const closeSelected = JSON.parse(
                      JSON.stringify(selectedImages)
                    );
                    const finalData = closeSelected.filter(
                      (data: string) => item !== data
                    );
                    onSelectImage(finalData);
                  }}
                  style={styles.closeButton}
                >
                  <Ionicons color="white" name="close" size={18} />
                </TouchableOpacity>
                <Image
                  source={{ uri: item }}
                  style={[styles.takeImageContainer, styles.imageStyle]}
                  resizeMode="contain"
                />
              </View>
            ))}
        </View>
      </ScrollView>
      <ActionSheet
        ref={actionSheetRef}
        title="Select option for image upload"
        options={['Camera', 'Gallery', 'Cancel']}
        tintColor="black"
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={async (index: any) => {
          if (index === 0) {
            await handleCameraLaunch();
          } else if (index === 1) {
            await openImagePicker();
          }
        }}
      />
    </>
  );
}

export default CustomImagePicker;

const styles = StyleSheet.create({
  takeImageContainer: {
    borderRadius: 24,
    height: 110,
    width: 110,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
  },
  textCenter: { textAlign: 'center' },
  addImageText: {
    textAlign: 'center',
    color: '#BDBEBF',
    marginTop: 5,
    fontSize: 17,
  },
  imageStyle: {
    marginLeft: 10,
  },
  closeButton: {
    padding: 2,
    backgroundColor: Colors.primaryDark,
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginBottom: 20,
    position: 'absolute',
    top: 0,
    left: 105,
    zIndex: 20000,
  },
});

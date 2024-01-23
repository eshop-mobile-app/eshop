import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

function ImageWithBlurBg(props: any) {
  const { url, imageHeight, borderRadius } = props;

  return (
    <>
      <View style={[styles.blurImageStyle, { borderRadius }]}>
        <Image
          source={{ uri: url }}
          blurRadius={20}
          style={{
            height: imageHeight || '100%',
            width: '100%',
            borderRadius: borderRadius || 20,
          }}
        />
        <View style={[styles.overlay, { height: imageHeight }]} />
      </View>
      <View
        style={{
          overflow: 'hidden',
          borderRadius: borderRadius || 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={{ uri: url }}
          style={[styles.imageStyle, { height: imageHeight || '100%' }]}
          resizeMode="center"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: '100%',
    width: '100%',
    zIndex: 300,
  },
  blurImageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.1,
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    zIndex: 0,
    borderRadius: 20,
  },
});

export default ImageWithBlurBg;

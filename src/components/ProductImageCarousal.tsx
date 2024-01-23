import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Swiper from 'react-native-swiper';
import Colors from '../utils/colors';
import ImageWithBlurBg from './ImageWithBlurBg';

function ProductImageCarousal(props: any) {
  const { data } = props;

  return data?.length ? (
    <Swiper
      loop={false}
      containerStyle={{ padding: 0, margin: 0 }}
      style={styles.wrapper}
      activeDotColor={Colors.primaryDark}
      showsButtons={false}
    >
      {data?.map((item: string) => (
        <View key={item} style={styles.mainContainer}>
          <View style={styles.bgView} />
          <View style={styles.slideStyle}>
            <ImageWithBlurBg url={item} imageHeight="80%" />
          </View>
        </View>
      ))}
    </Swiper>
  ) : null;
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    padding: 0,
    margin: 0,
  },
  wrapper: {
    height: '100%',
    padding: 0,
  },
  bgView: {
    height: '65%',
    width: '130%',
    backgroundColor: Colors.primaryBg,
    zIndex: 1,
  },
  slideStyle: {
    height: '100%',
    width: '100%',
    paddingRight: 40,
    zIndex: 10,
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default ProductImageCarousal;

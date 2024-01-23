import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CustomBack from '../components/CustomBack';
import Colors from '../utils/colors';
import RenderStars from '../components/RenderStar';
import GlobalStyles from '../utils/globalStyles';
import { useGetProductReviewsQuery } from '../store/services/product';
import {
  average,
  capitalizeText,
  formatSecondsToDate,
} from '../utils/commonFunctions';

function RenderReviewCard(props: any) {
  const { rating, count, total } = props;
  const colouredPart = (Number(count) / Number(total)) * 100;
  return (
    <View
      style={[
        GlobalStyles.rowBetween,
        { width: '100%', paddingHorizontal: 30 },
      ]}>
      <View
        style={{
          marginRight: 30,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <RenderStars rating={rating} starSize={18} />
      </View>
      <View
        style={[
          GlobalStyles.flexRow,
          {
            flexGrow: 1,
            flexShrink: 1,
            borderWidth: 1,
            borderColor: Colors.primaryDark,
            borderRadius: 10,
            height: 7,
          },
        ]}>
        <View
          style={{
            backgroundColor: Colors.primaryDark,
            width: `${colouredPart}%`,
            height: '100%',
          }}
        />
        <View
          style={{
            width: `${100 - colouredPart}%`,
            height: 6,
          }}
        />
      </View>
      <Text style={styles.countText}>{count}</Text>
    </View>
  );
}

type ProductReviewsProps = {
  route: any;
};

function ProductReviews({ route }: ProductReviewsProps) {
  const productId = route?.params?.productId;

  const { data: productReview, isLoading: reviewLoading } =
    useGetProductReviewsQuery<any>({ productId });
  const [commentReviews, setCommentReviews] = useState([]);
  const [avgRating, setAvgRating] = useState<any>('-');

  const ratingArray = [
    {
      rating: 5,
      count: productReview?.filter((item: any) => item.rating === 5)?.length,
    },
    {
      rating: 4,
      count: productReview?.filter((item: any) => item.rating === 4)?.length,
    },
    {
      rating: 3,
      count: productReview?.filter((item: any) => item.rating === 3)?.length,
    },
    {
      rating: 2,
      count: productReview?.filter((item: any) => item.rating === 2)?.length,
    },
    {
      rating: 1,
      count: productReview?.filter((item: any) => item.rating === 1)?.length,
    },
  ];

  useEffect(() => {
    if (!reviewLoading && productReview?.length) {
      const stars = productReview.map((item: any) => item.rating);
      setAvgRating(average(stars));
      const productReviewWithComments = productReview?.filter(
        (item: any) => item.comment?.trim()?.length
      );
      setCommentReviews(productReviewWithComments);
    } else {
      setCommentReviews([]);
      setAvgRating('-');
    }
  }, [productReview, reviewLoading, setAvgRating]);

  return reviewLoading ? (
    <View style={[{ flex: 1 }, GlobalStyles.flexRow]}>
      <ActivityIndicator color={Colors.primaryDark} size={40} />
    </View>
  ) : (
    <>
      <View style={styles.topContainer}>
        <CustomBack />
        <Text style={[styles.welcomeText, { width: '70%' }]}>Reviews</Text>
      </View>
      <View
        style={[
          styles.overviewSection,
          { alignItems: 'center', justifyContent: 'center' },
        ]}>
        <Text style={styles.mainRatingText}>{avgRating}</Text>
        <RenderStars
          rating={avgRating}
          starSize="26"
          color={Colors.primaryDark}
        />
        <Text style={styles.basedOnText}>
          Based on {productReview?.length} reviews
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={[
            styles.overviewSection,
            {
              paddingBottom: 20,
            },
          ]}>
          {ratingArray?.map((ratingItem: any) => (
            <View key={ratingItem.rating}>
              <RenderReviewCard
                rating={ratingItem.rating}
                count={ratingItem.count}
                total={productReview?.length}
              />
            </View>
          ))}
        </View>
        <View>
          {commentReviews?.length ? (
            commentReviews?.map((item: any) => (
              <View key={item?.id} style={styles.reviewContainer}>
                <View
                  style={[
                    GlobalStyles.rowBetween,
                    {
                      marginBottom: 6,
                      alignItems: 'flex-start',
                    },
                  ]}>
                  <Text style={styles.userName}>
                    {capitalizeText(item?.userData?.name)}
                  </Text>
                  <Text style={styles.postedDate}>
                    {formatSecondsToDate(item?.datePosted?.seconds)}
                  </Text>
                </View>
                <View
                  style={[
                    GlobalStyles.flexRow,
                    { justifyContent: 'flex-start', marginLeft: -4 },
                  ]}>
                  <RenderStars
                    rating={item?.rating}
                    color={Colors.primaryDark}
                    starSize={18}
                  />
                  <Text style={styles.rating}>{item?.rating}</Text>
                </View>
                <Text style={styles.comment}>{item?.comment}</Text>
              </View>
            ))
          ) : (
            <View style={GlobalStyles.flexRow}>
              <Text style={styles.noCommentText}>No comments</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: Colors.primaryBg,
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewSection: {
    backgroundColor: Colors.bgOpaqueBrown,
    width: '100%',
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: '900',
    color: 'white',
    flexGrow: 1,
    textAlign: 'center',
    marginRight: '12%',
  },
  countText: {
    textAlign: 'right',
    color: Colors.primaryBg,
    fontSize: 16,
    fontWeight: '800',
    width: 40,
  },
  mainRatingText: {
    textAlign: 'center',
    color: Colors.primaryDark,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  basedOnText: {
    textAlign: 'center',
    color: Colors.primaryDark,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
    width: '75%',
  },
  postedDate: {
    fontSize: 13,
    fontWeight: '600',
    color: 'grey',
    textAlign: 'right',
    marginTop: 2,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginLeft: 8,
  },
  comment: {
    fontSize: 15,
    fontWeight: '400',
    color: 'black',
    lineHeight: 20,
    marginTop: 6,
  },
  reviewContainer: {
    marginHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.bgOpaqueBrown,
    paddingHorizontal: 8,
  },
  noCommentText: { marginTop: '20%', fontSize: 16, color: Colors.primaryDark },
});

export default ProductReviews;

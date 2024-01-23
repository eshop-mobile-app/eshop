import React from 'react';
import StarRating from 'react-native-star-rating-widget';
import Colors from '../utils/colors';

function RenderStars(props: any) {
  const { rating, starSize, color, addReview } = props;
  return (
    <StarRating
      enableHalfStar={false}
      rating={rating}
      onChange={count => addReview?.(count)}
      starSize={starSize || 22}
      color={color || Colors.primaryBg}
      style={{ width: 'auto' }}
      starStyle={{
        padding: 0,
        margin: 0,
        marginRight: 0,
        marginLeft: 0,
      }}
    />
  );
}

export default RenderStars;

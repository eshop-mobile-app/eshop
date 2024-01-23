import * as React from 'react';
import { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/colors';
import CustomButton from './CustomButton';
import RenderStars from './RenderStar';
import GlobalStyles from '../utils/globalStyles';
import { ReviewModel } from '../store/services/types';

type AddReviewProps = {
  isVisible: boolean;
  closeModal: () => any;
  submitReview: (args: string) => any;
  isViewable: boolean;
  productReview: ReviewModel;
};

function AddReview(props: AddReviewProps): JSX.Element {
  const { isVisible, closeModal, submitReview, isViewable, productReview } =
    props;
  const [comment, setComment] = useState('');

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.mainContainer}>
        <View style={GlobalStyles.rowBetween}>
          {isViewable ? (
            <View style={styles.mb10}>
              <RenderStars
                rating={productReview?.rating}
                disabled
                starSize={30}
              />
            </View>
          ) : (
            <View />
          )}
          <TouchableOpacity
            onPress={() => {
              setComment('');
              closeModal();
            }}
            style={styles.closeButton}>
            <Ionicons color="white" name="close" size={20} />
          </TouchableOpacity>
        </View>

        {isViewable ? (
          <View style={styles.alignStart}>
            <Text style={styles.commentText}>{productReview?.comment}</Text>
          </View>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                multiline
                numberOfLines={5}
                value={comment}
                placeholder="Add comment"
                onChangeText={setComment}
                style={styles.inputStyle}
                onSubmitEditing={() => submitReview(comment)}
              />
            </View>
            <CustomButton
              buttonText="Submit"
              onPress={() => submitReview(comment)}
            />
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    borderRadius: 10,
  },
  closeButton: {
    padding: 8,
    backgroundColor: Colors.primaryDark,
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  commentText: {
    fontSize: 16,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  mb10: { marginBottom: 10 },
  alignStart: { alignItems: 'flex-start' },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'lightgrey',
    marginBottom: 20,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  inputStyle: {
    height: 100,
    width: '100%',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontSize: 18,
  },
});

export default AddReview;

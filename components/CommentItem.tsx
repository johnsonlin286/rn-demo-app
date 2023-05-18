import { StyleSheet, Text, View } from "react-native";

import { CommentType } from '../types/types';
import Avatar from "./Avatar";
import FlatButton from "./FlatBtn";
import LikeBtn from "./LikeBtn";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/context/authContext";

type Props = {
  comment: CommentType,
  likeToggle: (type: string, id: string) => void,
  likeLoading: boolean,
  replyToggle: (id: string, replyTo: string) => void
}

const Comment: React.FC<Props> = ({ comment, likeToggle, likeLoading, replyToggle }) => {
  const { isAuth, user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (isAuth && comment) {
      comment.likes.forEach(like => {
        if (like.user?._id === user?.id) {
          setLiked(true);
        }
      })
    }
  }, [isAuth, comment, setLiked]);

  const likeToggleHandler = () => {
    // if (!isAuth) {
    //   return;
    // }
    // if (!liked) {
    //   likeToggle('like', comment._id);
    //   setLiked(true);
    // } else {
    //   const likeId = comment.likes.find(like => like.user._id === user?.id)?._id;
    //   if (likeId) {
    //     likeToggle('dislike', likeId);
    //     setLiked(false);
    //   };
    // }
  }

  return (
    <View style={styles.commentContainer}>
      <View style={styles.commentContent}>
        <Avatar text={comment.user.name} />
        <View style={styles.messageContainer}>
          <View style={styles.message}>
            <Text style={styles.textBold}>{comment.user.name} </Text>
            <Text>{comment.message}</Text>
          </View>
          {isAuth && <FlatButton title="Reply" onPress={replyToggle.bind(this, comment._id, comment.user.name)} />}
        </View>
      </View>
      <View style={styles.likeContainer}>
        {/* <LikeBtn size="sm" defaultValue={liked} loading={likeLoading} onPress={likeToggleHandler} /> */}
      </View>
    </View>
  )
}

const CommentItem: React.FC<Props> = ({ comment, likeToggle, likeLoading, replyToggle }) => {
  return (
    <View style={styles.container}>
      <Comment comment={comment} likeToggle={likeToggle.bind(this)} likeLoading={likeLoading} replyToggle={replyToggle.bind(this)} />
      {
        comment.reply && comment.reply?.length > 0 && (
          <View style={styles.replyContainer}>
            {
              comment.reply.map(reply => (
                <Comment key={reply._id} comment={reply} likeToggle={likeToggle.bind(this)} likeLoading={likeLoading} replyToggle={replyToggle.bind(this)} />
              ))
            }
          </View>
        )
      }
    </View>
  );
}

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  replyContainer: {
    flex: 1,
    marginLeft: 30,
  },
  commentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  commentContent: {
    flexDirection: 'row',
  },
  messageContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  message: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  textBold: {
    fontWeight: 'bold',
  },
  likeContainer: {
    alignItems: 'center',
  }
});
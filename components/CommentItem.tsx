import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import { likeComment, dislikeComment } from "../api/like";
import Avatar from "./Avatar";
import FlatButton from "./FlatBtn";
import LikeBtn from "./LikeBtn";
import { CommentType } from '../types/types';

type Props = {
  comment: CommentType,
  replyToggle: (id: string, replyTo: string) => void
}

const Comment: React.FC<Props> = ({ comment, replyToggle }) => {
  const { isAuth, user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [commentData, setCommentData] = useState<CommentType>();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuth && comment) {
      setCommentData(comment);
      const isLike = comment.likes.find(like => like.user._id === user?.id);
      if (isLike) {
        setLiked(true);
      } else setLiked(false);
    }
  }, [isAuth, comment, setLiked]);

  const likeToggleHandler = async () => {
    if (!isAuth || !commentData) return;
    setLoading(true);
    if (!liked) {
      const result = await likeComment(commentData._id);
      if (result.like) {
        const commentClone = commentData;
        if (commentClone) {
          commentClone.likes.push(result.like);
        }
        setCommentData(commentClone);
        setLiked(true);
      } else if (result.error && result.error !== undefined) {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      } else {
        setAlert({ color: 'red', message: 'Network Error' });
      }
    } else {
      const likeId = commentData.likes.find(like => like.user._id === user?.id)?._id;
      if (!likeId) {
        setAlert({ color: 'red', message: 'Like ID not found!' });
        return;
      }
      const result = await dislikeComment(likeId);
      if (result.dislike) {
        const commentClone = commentData;
        commentClone?.likes.filter(like => like._id !== result.dislike._id);
        const filterOut = commentClone?.likes.filter(like => like._id !== result.dislike._id);
        commentClone.likes = filterOut;
        setCommentData(commentClone);
        setLiked(false);
      } else if (result.error && result.error !== undefined) {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      } else {
        setAlert({ color: 'red', message: 'Network Error' });
      }
    }
    setLoading(false);
  }

  if (!commentData) return null

  return (
    <View style={styles.commentContainer}>
      <View style={styles.commentContent}>
        <Avatar text={commentData.user.name} />
        <View style={styles.messageContainer}>
          <View style={styles.message}>
            <Text style={styles.textBold}>{commentData.user.name} </Text>
            <Text>{commentData.message}</Text>
          </View>
          {isAuth && <FlatButton title="Reply" onPress={replyToggle.bind(this, commentData._id, commentData.user.name)} />}
        </View>
      </View>
      <View style={styles.likeContainer}>
        <LikeBtn size="sm" defaultValue={liked} loading={loading} onPress={likeToggleHandler} />
        <Text style={styles.likeTextCount}>{commentData.likes.length > 0 ? commentData.likes.length : null}</Text>
      </View>
    </View>
  )
}

const CommentItem: React.FC<Props> = ({ comment, replyToggle }) => {
  return (
    <View style={styles.container}>
      <Comment comment={comment} replyToggle={replyToggle.bind(this)} />
      {
        comment.reply && comment.reply?.length > 0 && (
          <View style={styles.replyContainer}>
            {
              comment.reply.map(reply => (
                <Comment key={reply._id} comment={reply} replyToggle={replyToggle.bind(this)} />
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
  },
  likeTextCount: {
    fontSize: 10,
  }
});
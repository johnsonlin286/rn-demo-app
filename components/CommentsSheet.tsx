import { useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import Colors from "../utils/Colors";
import { fetchComments, postComment, postReplyThread } from "../api/comments";
import { likeComment, dislikeComment } from "../api/like";
import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import { CommentType, PhotoType } from "../types/types";
import Sheet from "./Sheet";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import Avatar from "./Avatar";

type ReplyingType = {
  threadId: string,
  replyTo: string,
}

type Props = {
  id?: string,
  onDismiss: () => void
}

const CommentsSheet: React.FC<Props> = ({ id, onDismiss }) => {
  const { isAuth, user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const postId = useMemo(() => {
    return id
  }, [id]);
  const [photo, setPhoto] = useState<PhotoType | undefined>();
  const [comments, setComments] = useState<Array<CommentType>>([]);
  const [replying, setReplying] = useState<ReplyingType | undefined>();
  const [submiting, setSubmiting] = useState(false);
  const [likeLoding, setLikeLoading] = useState(false);

  useEffect(() => {
    if (!postId) {
      return;
    }
    const fetchingComments = async () => {
      const result = await fetchComments(postId);
      if (result.data) {
        setComments(() => result.data);
        setPhoto(result.photo);
      } else if (result.error && result.error !== undefined) {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      } else {
        setAlert({ color: 'red', message: 'Networ Error' });
      }
    }
    fetchingComments();
  }, [postId]);

  const renderListHeader = () => {
    if (!photo) return null;

    return (
      <View style={styles.listHeaderContainer}>
        <Avatar text={photo.user?.name} />
        <Text style={styles.listHeaderCaption}><Text style={styles.textBold}>{photo.user?.name}</Text> {photo.caption}</Text>
      </View>
    )
  }

  const postingComment = async (message: string) => {
    if (!isAuth || !postId) {
      return;
    }
    setSubmiting(true);
    if (!replying) {
      const result = await postComment(postId, message);
      if (result.postComment) {
        setComments(prev => [result.postComment, ...prev]);
      } else if (result.error && result.error !== undefined) {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      } else {
        setAlert({ color: 'red', message: 'Networ Error' });
      }
    } else {
      const result = await postReplyThread(replying.threadId, message);
      if (result.postReply) {
        const clone = comments;
        clone.map(comment => {
          if (comment._id === replying.threadId) {
            comment.reply?.push(result.postReply);
          }
        })
        setComments(() => clone);
      } else if (result.error && result.error !== undefined) {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      } else {
        setAlert({ color: 'red', message: 'Networ Error' });
      }
      setReplying(undefined);
    }
    setSubmiting(false);
  }

  const replyToggleHandler = (threadId: string, replyTo: string) => {
    setReplying(() => ({
      threadId,
      replyTo,
    }));
  }

  const likeToggleHandler = async (type: string, id: string) => {
    const clone = comments;
    setLikeLoading(true);
    if (type === 'like') {
      const result = await likeComment(id);
      if (!result.error) {
        clone.map(comment => {
          if (comment._id === id) {
            comment.likes.push(result);
          } else {
            comment.reply?.map(rply => {
              if (rply._id === id) {
                rply.likes.push(result);
              }
            })
          }
        });
      } else {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      }
    } else if (type === 'dislike') {
      const result = await dislikeComment(id);
      if (!result.error) {
        clone.map(comment => {
          if (comment.likes.filter(like => like._id === result._id).length > 0) {
            comment.likes = comment.likes.filter(like => like._id !== result._id);
          } else {
            comment.reply?.map(rply => {
              rply.likes = rply.likes.filter(like => like._id !== result._id);
            })
          }
        });
      } else {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      }
    }
    setComments(() => clone);
    setLikeLoading(false);
  }

  if (!postId) {
    return null
  }

  return (
    <Sheet
      showFooter={true}
      footer={isAuth ? <CommentForm userName={user?.name || ''} replyingTo={replying?.replyTo || ''} onSubmit={postingComment.bind(this)} cancelReply={() => setReplying(undefined)} submiting={submiting} /> : null}
      onDismiss={onDismiss}
    >
      {
        comments && comments.length > 0 ? (
          <BottomSheetFlatList
            data={comments} keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CommentItem comment={item} likeToggle={likeToggleHandler.bind(this)} likeLoading={likeLoding} replyToggle={replyToggleHandler.bind(this)} />
            )}
            ListHeaderComponent={renderListHeader}
            style={styles.container}
          />
        ) : <Text>No Comments yet...</Text>
      }
    </Sheet>
  );
}

export default CommentsSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    paddingBottom: 16,
    marginBottom: 16,
  },
  listHeaderCaption: {
    flexWrap: 'wrap',
    marginHorizontal: 12
  },
  textBold: {
    fontWeight: 'bold'
  }
});
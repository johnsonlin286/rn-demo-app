import { useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { BottomSheetView, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { fetchComments, postComment, postReplyThread } from "../api/comments";
import { likeComment, dislikeComment } from "../api/like";
import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import { CommentType } from "../types/types";
import Sheet from "./Sheet";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

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
  const [comments, setComments] = useState<Array<CommentType>>([]);
  const [replying, setReplying] = useState<ReplyingType | undefined>();
  const [submiting, setSubmiting] = useState(false);

  useEffect(() => {
    if (!postId) {
      return;
    }
    const fetchingComments = async () => {
      const result = await fetchComments(postId);
      if (!result.error) {
        setComments(() => result.data);
      } else {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      }
    }
    fetchingComments();
  }, [postId]);

  const postingComment = async (message: string) => {
    if (!isAuth || !postId) {
      return;
    }
    setSubmiting(true);
    if (!replying) {
      const result = await postComment(postId, message);
      if (!result.error) {
        setComments(prev => [result, ...prev])
      } else {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      }
    } else {
      const result = await postReplyThread(replying.threadId, message);
      if (!result.error) {
        const clone = comments;
        clone.map(comment => {
          if (comment._id === replying.threadId) {
            comment.reply?.push(result);
          }
        })
        setComments(() => clone);
      } else {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
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
      <BottomSheetView style={styles.container}>
        {
          comments && comments.length > 0 ? (
            <BottomSheetFlatList
              style={styles.commentList}
              data={comments} keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <CommentItem comment={item} likeToggle={likeToggleHandler.bind(this)} replyToggle={replyToggleHandler.bind(this)} />
              )}
            />
          ) : <Text>No Comments yet...</Text>
        }
      </BottomSheetView>
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
  commentList: {
    flex: 1
  }
});
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

  useEffect(() => {
    if (!postId) {
      return;
    }
    const fetchingComments = async () => {
      try {
        const result = await fetchComments(postId);
        setComments(() => result.data);
      } catch (error) {
        setAlert({ color: 'red', message: 'Something went wrong!' });
      }
    }
    fetchingComments();
  }, [postId]);

  const postingComment = async (message: string) => {
    if (!isAuth || !postId) {
      return;
    }
    if (!replying) {
      try {
        const newComment = await postComment(postId, message);
        setComments(prev => [newComment, ...prev])
      } catch (error) {
        setAlert({ color: 'red', message: 'Something went wrong' });
      }
    } else {
      try {
        const replyComment = await postReplyThread(replying.threadId, message);
        const clone = comments;
        clone.map(comment => {
          if (comment._id === replying.threadId) {
            comment.reply?.push(replyComment);
          }
        })
        setComments(() => clone);
      } catch (error) {
        setAlert({ color: 'red', message: 'Something went wrong' });
      }
      setReplying(undefined);
    }
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
      try {
        const like = await likeComment(id);
        clone.map(comment => {
          if (comment._id === id) {
            comment.likes.push(like);
          } else {
            comment.reply?.map(rply => {
              if (rply._id === id) {
                rply.likes.push(like);
              }
            })
          }
        });
      } catch (error) {
        setAlert({ color: 'red', message: 'Something went wrong!' });
      }
    } else if (type === 'dislike') {
      try {
        const dislike = await dislikeComment(id);
        clone.map(comment => {
          if (comment.likes.filter(like => like._id === dislike._id).length > 0) {
            comment.likes = comment.likes.filter(like => like._id !== dislike._id);
          } else {
            comment.reply?.map(rply => {
              rply.likes = rply.likes.filter(like => like._id !== dislike._id);
            })
          }
        });
      } catch (error) {
        setAlert({ color: 'red', message: 'Something went wrong!' });
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
      footer={isAuth ? <CommentForm userName={user?.name || ''} replyingTo={replying?.replyTo || ''} onSubmit={postingComment.bind(this)} cancelReply={() => setReplying(undefined)} /> : null}
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
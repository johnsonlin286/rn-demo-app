import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { BottomSheetView, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { fetchComments, postComment } from "../api/comments";
import { AuthContext } from "../store/context/authContext";
import Sheet from "./Sheet";
import CommentForm from "./CommentForm";

type LikesType = {
  _id: string
}

type ReplyType = {
  _id: string
}

type UserType = {
  _id: string,
  name: string
}

type CommentType = {
  _id: string,
  message: string,
  likes: LikesType[],
  reply: [ReplyType],
  user: UserType,
  total: number,
}

type Props = {
  id?: string,
  onDismiss: () => void
}

const CommentsSheet: React.FC<Props> = ({ id, onDismiss }) => {
  const { isAuth, user } = useContext(AuthContext);
  const postId = useMemo(() => {
    return id
  }, [id]);
  const [comments, setComments] = useState<Array<CommentType>>([]);

  useEffect(() => {
    if (!postId) {
      return;
    }
    const fetchingComments = async () => {
      const result = await fetchComments(postId);
      // console.log(result);
      setComments(() => result.data);
    }
    fetchingComments();
  }, [postId]);

  const postingComment = async (message: string) => {
    if (!postId) {
      return;
    }
    const result = await postComment(postId, message);
    // console.log(result);
  }

  if (!postId) {
    return null
  }

  return (
    <Sheet
      showFooter={true}
      footer={isAuth ? <CommentForm userName={user?.name || ''} onSubmit={postingComment.bind(this)} /> : null}
      onDismiss={onDismiss}
    >
      <BottomSheetView style={styles.container}>
        {
          comments && comments.length > 0 ? (
            <BottomSheetFlatList
              style={styles.commentList}
              data={comments} keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Text>{JSON.stringify(item)}</Text>
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
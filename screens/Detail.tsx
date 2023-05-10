import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import { fetchAllPosts, fetchPhoto } from "../api/posts";
import PostItem from "../components/PostItem";
import CommentsSheet from "../components/CommentsSheet";

type RootStackParamList = {
  Home: undefined,
  Detail: { id: string }
}

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

type DataType = {
  _id: string,
  caption: string,
  imageUrl: string,
  likes: any[],
  user: {
    _id: string,
    name: string,
  }
}

const DetailScreen = ({ route }: Props) => {
  const postId = useMemo(() => {
    return route?.params?.id;
  }, [route]);
  const { isAuth } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const totalPost = useRef(0);
  const [data, setData] = useState<Array<DataType>>();
  const [pickedPostId, setPickedPostId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetching = async () => {
      setLoading(true);
      const postResult = await fetchPhoto(postId);
      if (postResult) {
        setData(() => [postResult]);
        // const postsResult = await fetchMorePosts();
        // if (totalPost.current < postsResult.total) totalPost.current += postsResult.data.length;
        // setData(() => [postResult, ...postsResult.data]);
        setLoading(false);
      } else {
        setAlert({ color: 'red', message: 'Something Went Wrong!' });
      }
    }
    fetching();
  }, [postId]);

  const fetchMorePosts = async () => {
    const result = await fetchAllPosts({ isAuth, skip: totalPost.current, exclude: postId });
    return result;
  }

  if (loading) {
    return null
  }

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostItem data={item} onLoadComments={setPickedPostId} />}
        style={styles.listContainer}
      />
      <CommentsSheet id={pickedPostId} onDismiss={() => setPickedPostId(undefined)} />
    </>
  );
}

export default DetailScreen;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  }
});
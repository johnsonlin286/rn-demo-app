import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AlertContext } from "../store/context/alertContext";
import { fetchAllPosts, fetchPhoto } from "../api/posts";
import Layout from "../components/Layout";
import PostItem from "../components/PostItem";
import CommentsSheet from "../components/CommentsSheet";
import Placeholder from "../components/placeholder/PostItem";

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
  const { setAlert } = useContext(AlertContext);
  const [data, setData] = useState<Array<DataType>>([]);
  const totalPost = useRef(10);
  const [pickedPostId, setPickedPostId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetching = async () => {
      setLoading(true);
      const result = await fetchPhoto(postId);
      if (result.photo) {
        setData(() => [result.photo]);
      } else if (result.error && result.error !== undefined) {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      } else {
        setAlert({ color: 'red', message: 'Network Error' });
      }
      setLoading(false);
    }
    fetching();
  }, [postId]);

  const fetchMore = async () => {
    if (data.length >= totalPost.current) {
      return;
    };
    setLoading(true);
    const result = await fetchAllPosts({ skip: data.length, exclude: postId });
    if (result.data) {
      totalPost.current = result.total;
      if (result.data.length > 0) {
        setData(prev => [...prev, ...result.data.reverse()]);
      }
    } else if (result.error && result.error !== undefined) {
      const { data } = result.error;
      setAlert({ color: 'red', message: data.errors[0].message });
    } else {
      setAlert({ color: 'red', message: 'Network Error' });
    }
    setLoading(false);
  }

  return (
    <Layout>
      {
        !data && <Placeholder />
      }
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostItem data={item} onLoadComments={setPickedPostId} />}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={loading ? <Placeholder /> : null}
        style={styles.listContainer}
      />
      <CommentsSheet id={pickedPostId} onDismiss={() => setPickedPostId(undefined)} />
    </Layout>
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
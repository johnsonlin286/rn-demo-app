import { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthContext } from "../store/context/authContext";
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
  const { isAuth } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [data, setData] = useState<Array<DataType>>([]);
  const totalPost = useMemo(() => {
    return data?.length
  }, [data]);
  const [pickedPostId, setPickedPostId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [canloadmore, setCanloadmore] = useState(true);

  useEffect(() => {
    const fetching = async () => {
      setLoading(true);
      const result = await fetchPhoto(postId);
      if (result.photo) {
        setData(() => [result.photo]);
        fetchMore();
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
    if (!canloadmore) return;
    setLoading(true);
    const result = await fetchAllPosts({ skip: totalPost, exclude: postId });
    if (result.data) {
      if (result.data.length > 0) {
        setData(prev => [...prev, ...result.data.reverse()]);
      } else setCanloadmore(false);
    } else if (result.error && result.error !== undefined) {
      const { data } = result.error;
      setAlert({ color: 'red', message: data.errors[0].message });
    } else {
      setAlert({ color: 'red', message: 'Network Error' });
    }
    setLoading(false);
  }

  if (!data) return null;

  return (
    <Layout>
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
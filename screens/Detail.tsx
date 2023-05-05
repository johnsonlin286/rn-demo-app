import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { fetchPhoto } from "../api/posts";
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
  const [data, setData] = useState<Array<DataType>>();
  const [pickedPostId, setPickedPostId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetching = async () => {
      setLoading(true);
      const result = await fetchPhoto(postId);
      setData(() => [result]);
      setLoading(false);
    }

    fetching();
  }, [postId]);

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
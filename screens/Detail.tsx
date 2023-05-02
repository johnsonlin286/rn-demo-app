import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { fetchPhoto } from "../api/posts";
import Layout from "../components/Layout";
import PostItem from "../components/PostItem";

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
  const { height } = useWindowDimensions();
  const postId = useMemo(() => {
    return route?.params?.id;
  }, [route]);
  const [data, setData] = useState<Array<DataType>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetching = async () => {
      setLoading(true);
      const result = await fetchPhoto(postId);
      setData(() => [result]);
      setLoading(false);
    }

    fetching();
  }, [postId]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <PostItem data={item} />}
      style={styles.listContainer}
    />
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
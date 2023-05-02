import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { fetchPhoto } from "../api/posts";
import Layout from "../components/Layout";

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
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetching = async () => {
      setLoading(true);
      const result = await fetchPhoto(postId);
      setData(result);
      setLoading(false);
    }

    fetching();
  }, [postId]);

  return (
    <Layout>
      {
        data && (
          <Image source={{ uri: data.imageUrl }} style={[styles.image, { height: height / 4 }]} />
        )
      }
    </Layout>
  );
}

export default DetailScreen;

const styles = StyleSheet.create({
  image: {
    width: '100%',
  }
});
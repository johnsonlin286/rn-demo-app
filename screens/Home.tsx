import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import { fetchAllPosts } from "../api/posts";
import Layout from "../components/Layout";
import ImageThumbnail from "../components/ImageThumbnail";

type PostItemType = {
  _id: string,
  imageUrl: string,
}

type RootStackParamList = {
  Home: undefined
}

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const { isAuth, user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const totalPost = useRef(0);
  const [posts, setPosts] = useState<Array<PostItemType>>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser: string | null = useMemo(() => {
    if (user) {
      return user.id
    } else return null
  }, [user]);

  useEffect(() => {
    fetching(true);
  }, [currentUser]);

  const fetching = async (refatch?: boolean) => {
    setLoading(true);
    const result = await fetchAllPosts({ skip: refatch ? 0 : totalPost.current });
    if (!result.error) {
      totalPost.current = result.total;
      if (refatch) {
        setPosts(result.data);
      } else {
        setPosts(prev => [...prev, ...result.data]);
      }
    } else {
      const { data } = result.error;
      setAlert({ color: 'red', message: data.errors[0].message });
    }
    setLoading(false);
    setRefreshing(false);
  }

  const fetchMore = () => {
    if (posts.length >= totalPost.current) {
      return;
    }
    fetching();
  }

  return (
    <Layout>
      {
        posts && (<FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ImageThumbnail data={item} />
          )}
          numColumns={3}
          onEndReached={fetchMore}
          onEndReachedThreshold={0.2}
          onRefresh={() => {
            setRefreshing(true);
            fetching(true);
          }}
          refreshing={refreshing}
          style={styles.listContainer}
        />)
      }
    </Layout>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  }
});
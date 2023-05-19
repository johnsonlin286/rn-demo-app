import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import { fetchAllPosts } from "../api/posts";
import Layout from "../components/Layout";
import ImageThumbnail from "../components/ImageThumbnail";
import Placeholder from '../components/placeholder/ImageThumbnail';

type PostItemType = {
  _id: string,
  imageUrl: string,
}

function HomeScreen() {
  const { user } = useContext(AuthContext);
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
    if (result.data) {
      totalPost.current = result.total;
      if (refatch) {
        setPosts(result.data.reverse());
      } else {
        setPosts(prev => [...prev, ...result.data.reverse()]);
      }
    } else if (result.error && result.error !== undefined) {
      const { data } = result.error;
      setAlert({ color: 'red', message: data.errors[0].message });
    } else {
      setAlert({ color: 'red', message: 'Network Error' });
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

  const renderPlaceholder = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(<Placeholder key={i} />)
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        {items.map(item => item)}
      </View>
    )
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
          ListFooterComponent={loading ? renderPlaceholder() : null}
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
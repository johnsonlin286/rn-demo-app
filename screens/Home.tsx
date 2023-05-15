import { useContext, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { AuthContext } from "../store/context/authContext";
import { fetchAllPosts } from "../api/posts";
import Layout from "../components/Layout";
import ImageThumbnail from "../components/ImageThumbnail";

type PostItemType = {
  _id: string,
  imageUrl: string,
}

function HomeScreen() {
  const { isAuth } = useContext(AuthContext);
  const totalPost = useRef(0);
  const [posts, setPosts] = useState<Array<PostItemType>>([]);
  const [loading, setLoading] = useState(false);

  const fetching = async () => {
    setLoading(true);
    try {
      const result = await fetchAllPosts({ isAuth, skip: totalPost.current });
      if (totalPost.current < result.total) totalPost.current += result.data.length;
      setPosts(prev => [...result.data, ...prev]);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetching();
  }, []);

  const fetchMore = () => {
    if (totalPost.current === posts.length) {
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
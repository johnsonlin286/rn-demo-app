import { useContext, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { AuthContext } from "../store/context/authContext";
import { fetchAllPosts } from "../api/posts";
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
    const result = await fetchAllPosts(isAuth, totalPost.current);
    if (totalPost.current !== result.total) totalPost.current = result.total;
    setPosts(prev => [...result.data, ...prev]);
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
    <>
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
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  }
});
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { fetchProfile } from "../api/user";
import { fetchUserPhotos } from "../api/posts";
import { AlertContext } from "../store/context/alertContext";
import Layout from "../components/Layout";
import PostItem from "../components/PostItem";
import ProfileHeading from "../components/ProfileHeading";
import CommentsSheet from "../components/CommentsSheet";
import HeadingPlaceholder from '../components/placeholder/ProfileHeading';
import PostPlaceholder from "../components/placeholder/PostItem";
import { UserType } from "../types/types";

type RootStackParamList = {
  User: { id: string }
}

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

type Props = NativeStackScreenProps<RootStackParamList, 'User'>

function UserScreen({ route, navigation }: Props) {
  const { setAlert } = useContext(AlertContext);
  const [userId, setUserId] = useState<string>();
  const [user, setUser] = useState<UserType>();
  const [data, setData] = useState<Array<DataType>>([]);
  const totalPosts = useRef(10);
  const [pickedPostId, setPickedPostId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (route.params && route.params.id) {
      setUserId(route.params.id);
    }
  }, [route]);

  useEffect(() => {
    if (!userId) return;
    const fetchingUserProfile = async () => {
      setLoading(true);
      const result = await fetchProfile(userId);
      if (result.profile) {
        setUser(result.profile);
        navigation.setOptions({
          title: result.profile.name
        });
      } else if (result.error && result.error !== undefined) {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      } else {
        setAlert({ color: 'red', message: 'Networ Error' });
      }
    }
    fetchingUserProfile();
  }, [userId, navigation]);

  useEffect(() => {
    if (userId) {
      fetchingUserPhotos();
    }
  }, [userId]);

  const fetchingUserPhotos = async () => {
    if (data.length >= totalPosts.current || !userId) return;
    setLoading(true);
    const result = await fetchUserPhotos(userId, data.length);
    if (result.data) {
      totalPosts.current = result.total;
      if (result.data.length > 0) {
        setData(prev => [...prev, ...result.data.reverse()]);
      }
    } else if (result.error && result.error !== undefined) {
      const { data } = result.error;
      setAlert({ color: 'red', message: data.errors[0].message });
    } else {
      setAlert({ color: 'red', message: 'Networ Error' });
    }
    setLoading(false);
  }

  return (
    <Layout>
      {
        loading && (
          <View style={styles.container}>
            <HeadingPlaceholder />
            <PostPlaceholder />
            <PostPlaceholder />
          </View>
        )
      }
      {
        data && data.length > 0 ? (
          <>
            <FlatList
              data={data}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <PostItem data={item} onLoadComments={setPickedPostId} />}
              onEndReached={fetchingUserPhotos}
              onEndReachedThreshold={0.2}
              style={styles.container}
              ListHeaderComponent={<ProfileHeading userName={user?.name || ''} postCount={data.length} />}
              ListFooterComponent={data.length >= totalPosts.current ? null : <PostPlaceholder />}
            />
            {
              pickedPostId && <CommentsSheet id={pickedPostId} onDismiss={() => setPickedPostId(undefined)} />
            }
          </>
        ) : !loading && (
          <View style={styles.container}>
            <ProfileHeading userName={user?.name || ''} postCount={data.length} />
            <View style={styles.containerEmpty}>
              <Text style={styles.emptyText}>{`${user?.name} don't have any post yet...`}</Text>
            </View>
          </View>
        )
      }
    </Layout>
  );
}

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  containerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
  }
})
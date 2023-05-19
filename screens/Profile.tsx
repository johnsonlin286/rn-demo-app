import { StyleSheet, View, FlatList, Text } from "react-native";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import Layout from "../components/Layout";
import ProfileHeading from "../components/ProfileHeading";
import LogoutModal from "../components/LogoutModal";
import { deletePost, fetchUserPhotos } from "../api/posts";
import PostItem from "../components/PostItem";
import CommentsSheet from "../components/CommentsSheet";
import DeleteModal from "../components/DeleteModal";
import Placeholder from "../components/placeholder/PostItem";

type RootStackParamList = {
  Profile: undefined
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

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>

function ProfileScreen({ navigation }: Props) {
  const { isAuth, user, signout } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [data, setData] = useState<Array<DataType>>([]);
  const totalPosts = useRef(0);
  const [pickedPostId, setPickedPostId] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [canloadmore, setCanloadmore] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useLayoutEffect(() => {
    if (isAuth && user) {
      navigation.setOptions({ title: user.name });
    }
  }, [navigation, isAuth, user]);

  useEffect(() => {
    if (data.length === 0) {
      fetchingUserPhoto();
    } else if (data.length >= totalPosts.current) {
      setCanloadmore(false);
    }
  }, [data, totalPosts, setCanloadmore]);

  const fetchingUserPhoto = async () => {
    if (!user || !canloadmore) return;
    setLoading(true);
    const result = await fetchUserPhotos(user?.id, data.length);
    if (result.data) {
      if (result.data.length > 0) {
        setData(prev => [...prev, ...result.data.reverse()]);
        totalPosts.current = result.total;
      }
    } else if (result.error && result.error !== undefined) {
      const { data } = result.error;
      setAlert({ color: 'red', message: data.errors[0].message });
    } else {
      setAlert({ color: 'red', message: 'Network Error' });
    }
    setLoading(false);
  }

  const deletingPost = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const clone = data;
    const postIndex = clone.findIndex(item => item._id === deleteId);
    if (postIndex === -1) {
      setDeleteId(undefined);
      setDeleting(false);
      setAlert({ color: 'red', message: 'Post not found!' });
      return;
    }
    const result = await deletePost(deleteId);
    if (result.deletePost) {
      clone.splice(postIndex, 1)
      setData(clone);
    } else if (result.error && result.error !== undefined) {
      const { data } = result.error;
      setAlert({ color: 'red', message: data.errors[0].message });
    } else {
      setAlert({ color: 'red', message: 'Network Error' });
    }
    setDeleteId(undefined);
    setDeleting(false);
  }

  const logoutToggle = () => setLogoutConfirm(!logoutConfirm);

  return (
    <Layout>
      {
        data && data.length > 0 ? (
          <>
            <FlatList
              data={data}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <PostItem data={item} onLoadComments={setPickedPostId} isOwnerPost onDelete={setDeleteId} />}
              onEndReached={fetchingUserPhoto}
              onEndReachedThreshold={0.2}
              style={styles.container}
              ListHeaderComponent={<ProfileHeading userName={user?.name || ''} postCount={data.length} onLogoutPress={logoutToggle} isOwnProfile />}
              ListFooterComponent={loading ? <Placeholder /> : null}
            />
            <CommentsSheet id={pickedPostId} onDismiss={() => setPickedPostId(undefined)} />
            <DeleteModal isVisible={deleteId ? true : false} deleting={deleting} onConfirm={deletingPost} onDismiss={() => setDeleteId(undefined)} />
          </>
        ) : (
          <View style={styles.container}>
            <ProfileHeading userName={user?.name || ''} postCount={data.length} onLogoutPress={logoutToggle} isOwnProfile />
            <View style={styles.containerEmpty}>
              <Text style={styles.emptyText}>You don't have any post yet...</Text>
            </View>
          </View>
        )
      }
      {
        isAuth && <LogoutModal isVisible={logoutConfirm} onDismiss={logoutToggle} onConfirm={signout} />
      }
    </Layout>
  );
}

export default ProfileScreen;

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
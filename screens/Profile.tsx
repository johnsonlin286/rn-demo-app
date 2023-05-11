import { StyleSheet, View, FlatList } from "react-native";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import Layout from "../components/Layout";
import ProfileHeading from "../components/ProfileHeading";
import LogoutModal from "../components/LogoutModal";
import { fetchUserPhotos } from "../api/posts";
import PostItem from "../components/PostItem";

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
  const [canloadmore, setCanloadmore] = useState(true);

  useLayoutEffect(() => {
    if (isAuth && user) {
      navigation.setOptions({ title: user.name });
    }
  }, [navigation, isAuth, user]);

  useEffect(() => {
    fetchingUserPhoto();
  }, []);

  const logoutToggle = () => setLogoutConfirm(!logoutConfirm);

  const fetchingUserPhoto = async () => {
    if (!user || !canloadmore) return;
    try {
      const result = await fetchUserPhotos(user?.id, data.length);
      if (result.data.length > 0) {
        setData(prev => [...prev, ...result.data]);
      } else {
        setCanloadmore(false);
      }
    } catch (error) {
      setAlert({ color: 'red', message: 'Something went wrong!' });
      console.log(error);
    }
  }

  return (
    <Layout>
      {
        data && data.length > 0 ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <PostItem data={item} onLoadComments={() => null} isOwnerPost />}
            onEndReached={fetchingUserPhoto}
            onEndReachedThreshold={0.2}
            style={styles.container}
            ListHeaderComponent={<ProfileHeading userName={user?.name || ''} postCount={data.length} onLogoutPress={logoutToggle} isOwnProfile />}
          />
        ) : (
          <View></View>
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
})
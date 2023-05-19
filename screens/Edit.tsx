import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { editPost, fetchPhoto } from '../api/posts';

import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import Layout from "../components/Layout";
import PostForm from "../components/PostForm";

type RootTabStackParamList = {
  Auth: undefined;
  Edit: { id: string };
  Profile: undefined;
}

type FormTypes = {
  uri: string,
  caption: string,
}

type Props = BottomTabScreenProps<RootTabStackParamList, 'Edit'>;

const EditScreen = ({ route, navigation }: Props) => {
  const { isAuth } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [formState, setFormState] = useState<FormTypes>({} as FormTypes);
  const [posting, setPosting] = useState(false);

  useLayoutEffect(() => {
    if (!isAuth) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      })
    } else {
      if (route.params && route.params.id) {
        setEditingId(route.params.id);
      } else {
        setAlert({ color: 'red', message: 'Post ID not found!' });
        navigation.goBack();
      }
    }
  }, [navigation, isAuth, setAlert]);

  useEffect(() => {
    if (editingId === undefined) {
      return;
    }
    const fetching = async () => {
      // setLoading(true);
      const result = await fetchPhoto(editingId);
      if (result.photo) {
        setFormState(() => ({
          uri: result.photo.imageUrl,
          caption: result.photo.caption
        }))
      } else if (result.error && result.error !== undefined) {
        const { data } = result.error;
        setAlert({ color: 'red', message: data.errors[0].message });
      } else {
        setAlert({ color: 'red', message: 'Network Error' });
      }
      // setLoading(false);
    }
    fetching();
  }, [editingId]);

  const submitFormState = async (value: FormTypes) => {
    if (editingId === undefined) {
      return;
    }
    setPosting(true);
    setFormState(() => ({
      ...value
    }));
    const result = await editPost(editingId, value.caption);
    if (result.updatePost) {
      setAlert({ color: 'green', message: 'Edit post success!' });
      navigation.reset({
        index: 1,
        routes: [{ name: 'Profile' }]
      });
      navigation.navigate('Profile');
    } else if (result.error && result.error !== undefined) {
      const { data } = result.error;
      setAlert({ color: 'red', message: data.errors[0].message });
    } else {
      setAlert({ color: 'red', message: 'Network Error' });
    }
    setPosting(false);
  }

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <PostForm formData={formState} submitForm={submitFormState.bind(this)} posting={posting} />
      </ScrollView>
    </Layout>
  );
}

export default EditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
})
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { insertPost } from '../api/posts';

import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import Layout from "../components/Layout";
import PostForm from "../components/PostForm";

type RootTabStackParamList = {
  Auth: undefined;
  Form: undefined;
  Profile: undefined;
}

type FormTypes = {
  uri: string,
  caption: string,
}

type Props = BottomTabScreenProps<RootTabStackParamList, 'Form'>;

const FormScreen = ({ navigation }: Props) => {
  const { isAuth, user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [formState, setFormState] = useState<FormTypes>({} as FormTypes);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [posting, setPosting] = useState(false);

  useLayoutEffect(() => {
    if (!isAuth) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      })
    }
  }, [navigation, isAuth]);

  const updateFormState = (value: FormTypes) => {
    setFormState(() => ({
      ...value
    }));
  }

  useEffect(() => {
    if (Object.keys(formState).length > 0 && !uploadingImg) {
      uploadImage();
    }
  }, [formState]);

  const uploadImage = async () => {
    setPosting(true);
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      }
      xhr.onerror = (e) => {
        // console.log(e);
        reject(new TypeError('Network request failed'));
      }
      xhr.responseType = "blob";
      xhr.open("GET", formState.uri, true);
      xhr.send(null);
    });
    const imageRef = ref(storage, `posts_${process.env.ENVI}/${new Date().toISOString()}_${user?.id}`);
    await uploadBytes(imageRef, blob).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setFormState(prev => ({
          ...prev,
          uri: url
        }));
        setUploadingImg(true);
      }).catch((error) => {
        setAlert({ color: 'red', message: 'Upload photo filed!' });
      })
    }).catch(() => {
      setAlert({ color: 'red', message: 'Upload photo filed!' });
    });
    blob.close();
  }

  useEffect(() => {
    if (uploadingImg) submitFormState();
  }, [uploadingImg]);

  const submitFormState = async () => {
    const result = await insertPost(formState.uri, formState.caption);
    if (result.post) {
      setAlert({ color: 'green', message: 'Posting success!' });
      setFormState({} as FormTypes);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }]
      });
    } else if (result.error && result.error !== undefined) {
      const { data } = result.error;
      setAlert({ color: 'red', message: data.errors[0].message });
    } else {
      setAlert({ color: 'red', message: 'Network Error' });
    }
    setUploadingImg(false);
    setPosting(false);
  }

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <PostForm submitForm={updateFormState.bind(this)} posting={posting} />
      </ScrollView>
    </Layout>
  );
}

export default FormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
})
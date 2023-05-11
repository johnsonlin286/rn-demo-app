import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { insertPost } from '../api/posts';

import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";
import PhotoPicker from "../components/PhotoPicker";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Layout from "../components/Layout";

type RootTabStackParamList = {
  Index: undefined;
  Form: { id: string | undefined };
  Auth: undefined;
  Profile: undefined;
}

type FormTypes = {
  uri: string,
  caption: string,
}

type Props = BottomTabScreenProps<RootTabStackParamList, 'Form'>;

const FormScreen = ({ route, navigation }: Props) => {
  const { isAuth, user } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [formState, setFormState] = useState<FormTypes>({} as FormTypes);
  const [errMsg, setErrMsg] = useState<FormTypes>({} as FormTypes);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [posting, setPosting] = useState(false);

  useLayoutEffect(() => {
    if (!isAuth) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      })
    } else {
      if (route.params && route.params.id) {
        console.log('edit post');
      }
    }
  }, [route, navigation, isAuth]);

  const updateFormState = (key: string, value: string) => {
    setFormState(prev => (
      {
        ...prev,
        [key]: value
      }
    ))
  }

  const formValidation = () => {
    const errMsg: FormTypes = {} as FormTypes;
    if (!formState.uri) {
      errMsg.uri = 'required!';
    } else errMsg.uri = '';
    if (!formState.caption) {
      errMsg.caption = 'required!';
    } else errMsg.caption = '';
    setErrMsg(errMsg);
    const hasError = Object.values(errMsg).map(item => item.trim().length > 0).includes(true);
    if (hasError) {
      return
    }
    uploadImage();
  }

  const uploadImage = async () => {
    setPosting(true);
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      }
      xhr.onerror = (e) => {
        console.log(e);
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
        console.log('getDownloadURL', error);
        throw new Error(error);
      })
    }).catch((error) => {
      console.log('uploadBytes', error);
      throw new Error(error);
    });
    blob.close();
  }

  useEffect(() => {
    if (uploadingImg) submitFormState();
  }, [uploadingImg]);

  const submitFormState = async () => {
    try {
      const result = await insertPost(formState.uri, formState.caption);
      setFormState(() => ({ uri: '', caption: '' }));
      setUploadingImg(false);
      setPosting(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Profile' }]
      });
    } catch (error) {
      setUploadingImg(false);
      setPosting(false);
      setAlert({ color: 'red', message: 'Posting Failed!' });
    }
  }

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardAvoid}>
          <PhotoPicker defaultValue={formState.uri} onPicked={updateFormState.bind(this, 'uri')} isInvalid={errMsg.uri} />
          <InputField label="Caption:" value={formState.caption} multiline disabled={!formState.uri || false} onChange={updateFormState.bind(this, 'caption')} isInvlid={errMsg.caption} />
          <Button title="Post It!" disabled={posting} onPress={formValidation} style={styles.button} />
        </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
    paddingVertical: 8,
  },
  button: {
    marginVertical: 20,
  }
})
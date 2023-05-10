import { useContext, useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../store/context/authContext";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import PhotoPicker from "../components/PhotoPicker";
import InputField from "../components/InputField";
import Button from "../components/Button";

type RootTabStackParamList = {
  Index: undefined;
  Form: undefined;
  Auth: undefined;
  Profile: undefined;
}

type FormTypes = {
  uri: string,
  caption: string,
}

type Props = BottomTabScreenProps<RootTabStackParamList>;

const FormScreen = ({ navigation }: Props) => {
  const { isAuth } = useContext(AuthContext);
  const [formState, setFormState] = useState<FormTypes>({} as FormTypes);
  const [errMsg, setErrMsg] = useState<FormTypes>({} as FormTypes);
  const [posting, setPosting] = useState(false);

  useLayoutEffect(() => {
    if (!isAuth) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      })
    }
  }, [navigation, isAuth]);

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
    submitPost();
  }

  const submitPost = async () => {
    console.log(formState);
  }

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoid}>
        <PhotoPicker onPicked={updateFormState.bind(this, 'uri')} isInvalid={errMsg.uri} />
        <InputField label="Caption:" multiline disabled={!formState.uri || false} onChange={updateFormState.bind(this, 'caption')} isInvlid={errMsg.caption} />
        <Button title="Post It!" disabled={posting} onPress={formValidation} style={styles.button} />
      </KeyboardAvoidingView>
    </ScrollView>
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
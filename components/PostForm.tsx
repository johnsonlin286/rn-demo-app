import { useEffect, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, } from 'react-native';

import PhotoPicker from './PhotoPicker';
import InputField from './InputField';
import Button from './Button';

type FormTypes = {
  uri: string,
  caption: string,
}

type Props = {
  formData?: FormTypes,
  submitForm: (data: FormTypes) => void,
  posting: boolean,
}

export default function PostForm(this: any, { formData, submitForm, posting }: Props) {
  const [formState, setFormState] = useState<FormTypes>({} as FormTypes);
  const [errMsg, setErrMsg] = useState<FormTypes>({} as FormTypes);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (formData) {
      setFormState(formData);
      setIsEditing(true);
    };
  }, [formData]);

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
    submitForm(formState);
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoid}>
      <PhotoPicker defaultValue={formState.uri} onPicked={updateFormState.bind(this, 'uri')} readonly={isEditing} isInvalid={errMsg.uri} />
      <InputField label="Caption:" value={formState.caption} multiline disabled={formState.uri ? false : true} onChange={updateFormState.bind(this, 'caption')} isInvlid={errMsg.caption} />
      <Button title={`${!isEditing ? 'Post It!' : 'Save Change'}`} disabled={posting} onPress={formValidation} style={styles.button} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    paddingVertical: 8,
  },
  button: {
    marginVertical: 20,
  }
});
import { useContext, useState } from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import InputField from "./InputField";
import Button from "./Button";
import { signup, signin } from "../api/auth";
import { AuthContext } from "../store/context/authContext";
import { AlertContext } from "../store/context/alertContext";

type FormType = {
  name: string
  email: string
  password: string
}

type Props = {
  isSignup?: boolean,
}

const AuthForm: React.FC<Props> = ({ isSignup }) => {
  const navigation = useNavigation<any>();
  const { authenticate } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [formState, setFormState] = useState<FormType>({} as FormType);
  const [formError, setFormError] = useState<FormType>({} as FormType);
  const [loading, setLoading] = useState(false);

  const updateFormState = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formValidation = () => {
    const errMsg: FormType = {} as FormType;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isSignup && !formState.name) {
      errMsg.name = 'required!';
    } else if (isSignup && formState.name.length < 3) {
      errMsg.name = 'minimum 3 characters lenght';
    } else errMsg.name = '';
    if (!formState.email) {
      errMsg.email = 'required!';
    } else if (!regex.test(formState.email)) {
      errMsg.email = 'not a valid email';
    } else errMsg.email = '';
    if (!formState.password) {
      errMsg.password = 'required!'
    } else if (isSignup && formState.password.length < 6) {
      errMsg.password = 'minimum 6 characters length'
    } else errMsg.password = '';
    setFormError(errMsg);
    const hasError = Object.values(errMsg).map(item => item.trim().length > 0).includes(true);
    if (hasError) {
      return
    }
    formSubmit();
  }

  const formSubmit = async () => {
    setLoading(true);
    if (isSignup) {
      const result = await signup(formState.name, formState.email, formState.password);
      navigation.navigate('Signin');
      setAlert({ color: 'green', message: `Your Account ${formState.email} successfully created!` });
    } else {
      const result = await signin(formState.email, formState.password);
      authenticate(result.token);
      navigation.navigate('Profile');
      setAlert({ color: 'green', message: `Hi ${result.name}, Welcome back!` });
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      {
        isSignup && <InputField label="Name" value={formState.name} onChange={updateFormState.bind(this, 'name')} style={styles.input} isInvlid={formError.name} />
      }
      <InputField label="Email" type="email-address" value={formState.email} onChange={updateFormState.bind(this, 'email')} style={styles.input} isInvlid={formError.email} />
      <InputField label="Password" secure value={formState.password} onChange={updateFormState.bind(this, 'password')} style={styles.input} isInvlid={formError.password} />
      <Button title="Sign In" onPress={formValidation} style={styles.button} />
    </KeyboardAvoidingView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  container: {
    width: '60%',
    marginTop: '20%'
  },
  input: {
    marginBottom: 16
  },
  button: {
    marginTop: 16
  }
})
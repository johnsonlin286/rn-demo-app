import { useState } from "react";
import { StyleSheet, View } from "react-native";
import InputField from "./InputField";
import Button from "./Button";

function AuthForm(this: any) {
  const [formState, setFormState] = useState({
    email: '',
    password: ''
  });

  const updateFormState = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <View style={styles.container}>
      <InputField label="Email" type="email-address" value={formState.email} onChange={updateFormState.bind(this, 'email')} style={styles.input} />
      <InputField label="Password" secure value={formState.password} onChange={updateFormState.bind(this, 'password')} style={styles.input} />
      <Button title="Sign In" onPress={() => null} style={styles.button} />
    </View>
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
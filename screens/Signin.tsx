import { View, Text, StyleSheet } from "react-native";

import AuthForm from "../components/AuthForm";
import FlatButton from "../components/FlatBtn";

type Props = {
  navigation: any
}

const SigninScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <AuthForm />
      <View style={styles.textWrapper}>
        <Text>
          Create new
        </Text>
        <FlatButton style={styles.button} title="account" onPress={() => navigation.navigate('Signup')} />
      </View>
    </View>
  );
}

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  button: {
    marginLeft: 3,
    marginTop: 2,
  }
})
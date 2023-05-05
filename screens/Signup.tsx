import { StyleSheet, Text, View, ScrollView } from "react-native";

import Layout from "../components/Layout";
import AuthForm from "../components/AuthForm";
import FlatButton from "../components/FlatBtn";

type Props = {
  navigation: any
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Layout>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <AuthForm isSignup />
          <View style={styles.textWrapper}>
            <Text>
              Have an account?
            </Text>
            <FlatButton style={styles.button} title="account" onPress={() => navigation.replace('Signin')} />
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

export default SignupScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
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
    marginBottom: 16
  },
  button: {
    marginLeft: 3,
    marginTop: 1,
  }
})
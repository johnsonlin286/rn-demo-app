import { StyleSheet, Text, View } from "react-native";
import { useContext } from "react";

import Layout from "../components/Layout";
import { AuthContext } from "../store/context/authContext";
import Button from "../components/Button";

function ProfileScreen() {
  const { signout } = useContext(AuthContext);

  return (
    <Layout>
      <View style={styles.container}>
        <Text>Profile Screen</Text>
        <Button title="Logout" onPress={signout} />
      </View>
    </Layout>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
import { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";

import Alert from "./Alert";

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <ScrollView style={styles.container}>
      <Alert color="green" icon="add" message="Test" />
      {children}
    </ScrollView>
  );
}

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
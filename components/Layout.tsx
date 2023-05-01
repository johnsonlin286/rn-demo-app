import { ReactNode, useContext } from "react";
import { ScrollView, View, StyleSheet } from "react-native";

import Alert from "./Alert";
import { AlertContext } from "../store/context/alertContext";

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const { isVisible } = useContext(AlertContext);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.container}>
      {isVisible && <Alert />}
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
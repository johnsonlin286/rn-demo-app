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
    <View style={styles.container}>
      {isVisible && <Alert />}
      {children}
    </View>
  );
}

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
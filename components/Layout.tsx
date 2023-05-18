import { ReactNode, useContext } from "react";
import { ScrollView, View, StyleSheet } from "react-native";

import { AlertContext } from "../store/context/alertContext";
import Alert from "./Alert";
import AboutSheet from "./AboutSheet";

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const { isVisible } = useContext(AlertContext);
  return (
    <View style={styles.container}>
      {isVisible && <Alert />}
      {children}
      <AboutSheet />
    </View>
  );
}

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
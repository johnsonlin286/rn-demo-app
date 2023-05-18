import { StyleSheet, Text } from "react-native";
import Sheet from "./Sheet";

import { useContext } from "react";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { AboutContext } from "../store/context/aboutContext";
import LinkFlatBtn from "./LinkFlatBtn";

const AboutSheet = () => {
  const { visible, hideToggle } = useContext(AboutContext);

  const BottomSheetFooter = () => {
    return (
      <Text style={styles.footer}>Version 1.0.0</Text>
    )
  }

  if (!visible) return null;

  return (
    <Sheet onDismiss={hideToggle} showFooter footer={BottomSheetFooter}>
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>About this app</Text>
        <BottomSheetView style={styles.paragraph}>
          <Text>This is </Text>
          <LinkFlatBtn title="React Native" url="https://reactnative.dev/" style={styles.linkBtn} />
          <Text> project build with </Text>
          <LinkFlatBtn title="Expo." url="https://expo.dev" style={styles.linkBtn} />
        </BottomSheetView>
        <BottomSheetView style={styles.paragraph}>
          <Text>This app is only for my experimentation and learning purposes. The same web application can also be viewed at: </Text>
          <LinkFlatBtn title="demo-app-johnsonlin286.vercel.app" url="https://demo-app-johnsonlin286.vercel.app/" />
        </BottomSheetView>
      </BottomSheetView>
    </Sheet>
  );
}

export default AboutSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paragraph: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  linkBtn: {
    marginTop: 2,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
  }
});
import { useContext, useLayoutEffect } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../store/context/authContext";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

type RootStackParamList = {
  Index: undefined;
  Form: undefined;
  Auth: undefined;
  Profile: undefined;
}

type Props = BottomTabScreenProps<RootStackParamList>;

const FormScreen = ({ navigation }: Props) => {
  const { isAuth } = useContext(AuthContext);

  useLayoutEffect(() => {
    if (!isAuth) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      })
    }
  }, [navigation, isAuth]);

  return (
    <View>
      <Text>Form Screen</Text>
    </View>
  );
}

export default FormScreen;
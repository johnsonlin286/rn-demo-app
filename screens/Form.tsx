import { useContext, useLayoutEffect } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../store/context/authContext";

type Props = {
  navigation: any
}

const FormScreen: React.FC<Props> = ({ navigation }) => {
  const { isAuth } = useContext(AuthContext);

  useLayoutEffect(() => {
    if (!isAuth) {
      // 
    }
  }, []);

  return (
    <View>
      <Text>Form Screen</Text>
    </View>
  );
}

export default FormScreen;
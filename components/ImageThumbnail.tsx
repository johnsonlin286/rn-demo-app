import { Image, Pressable, StyleSheet, View, useWindowDimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Colors from "../utils/Colors";

type RootStackParamList = {
  Home: undefined,
  Detail: { id: string }
}

type ThumbnailType = {
  _id: string,
  imageUrl: string,
}

type Props = {
  data: ThumbnailType
}

const ImageThumbnail: React.FC<Props> = ({ data }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width: width / 3 }]}>
      <Pressable
        android_ripple={{
          color: `${Colors.sky300}01`,
          foreground: true
        }}
        style={({ pressed }) => [styles.button, pressed && Platform.OS === 'ios' ? styles.pressed : null]}
        onPress={() => navigation.navigate('Detail', { id: data._id })}
      >
        <Image source={{ uri: data.imageUrl }} style={styles.image} />
      </Pressable>
    </View >
  );
}

export default ImageThumbnail;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    overflow: 'hidden',
    padding: 2,
  },
  button: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: .8
  },
  image: {
    width: '100%',
    height: '100%'
  }
});
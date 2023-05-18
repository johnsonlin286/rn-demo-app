import { useState } from "react";
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import Colors from "../utils/Colors";

type Props = {
  title: string
  onPress: () => void
  style?: ViewStyle
  textStyle?: TextStyle
}

const FlatButton: React.FC<Props> = ({ title, onPress, style, textStyle }) => {
  const [isPressed, setIsPressed] = useState(false);

  const onPressedHandler = () => {
    setIsPressed(true);
    onPress();
  }

  return (
    <Pressable style={[styles.button, style || null]} onPress={onPressedHandler} onPressOut={() => setIsPressed(false)}>
      <Text style={[styles.text, textStyle || null, isPressed ? styles.pressed : null]}>{title}</Text>
    </Pressable>
  );
};

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  text: {
    fontWeight: 'bold',
    lineHeight: 16,
    color: Colors.sky400
  },
  pressed: {
    color: Colors.sky600
  }
})
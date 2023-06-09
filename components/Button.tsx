import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Colors from "../utils/Colors";

type Props = {
  title: string,
  outline?: boolean,
  disabled?: boolean,
  onPress: () => void,
  style?: ViewStyle,
}

const Button: React.FC<Props> = ({ title, outline, disabled, onPress, style }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, outline ? styles.outline : null, disabled ? styles.disabled : null, pressed ? styles.pressed : null, style]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[styles.text, outline ? styles.textOutline : null]}>{title}</Text>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: Colors.sky400,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    paddingVertical: 6,
    paddingHorizontal: 16
  },
  outline: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.sky400
  },
  pressed: {
    backgroundColor: Colors.sky600,
    elevation: 1,
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
  },
  disabled: {
    backgroundColor: Colors.gray300,
  },
  text: {
    color: 'white',
    fontWeight: 'bold'
  },
  textOutline: {
    color: Colors.sky400
  }
});
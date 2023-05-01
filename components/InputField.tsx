import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

import Colors from "../utils/Colors";

type Props = {
  label: string
  type?: 'default' | 'email-address' | 'number-pad' | 'phone-pad'
  secure?: boolean,
  value?: string
  onChange: (value: string) => void
  style?: ViewStyle
  isInvlid?: string
}

const InputField: React.FC<Props> = ({ label, type, secure, value, onChange, style, isInvlid }) => {
  return (
    <View style={style || null}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType={type || 'default'} secureTextEntry={secure || false} />
      {
        isInvlid && <Text style={styles.invalidText}>{isInvlid}</Text>
      }
    </View>
  );
}

export default InputField;

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    paddingLeft: 3,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  invalidText: {
    fontSize: 12,
    color: Colors.red600,
    paddingLeft: 3
  }
})
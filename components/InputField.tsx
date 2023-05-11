import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

import Colors from "../utils/Colors";
import { useEffect, useRef } from "react";

type Props = {
  label?: string,
  placeholder?: string,
  type?: 'default' | 'email-address' | 'number-pad' | 'phone-pad',
  secure?: boolean,
  value?: string,
  multiline?: boolean,
  disabled?: boolean,
  onChange: (value: string) => void,
  style?: ViewStyle,
  isInvlid?: string,
}

const InputField: React.FC<Props> = ({ label, placeholder, type, secure, value, multiline, disabled, onChange, style, isInvlid }) => {
  return (
    <View style={style || null}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, disabled ? styles.disabled : null, multiline ? styles.multiline : null]}
        placeholder={placeholder || ''}
        value={value}
        multiline={multiline || false}
        numberOfLines={multiline ? 4 : 1}
        editable={disabled ? false : true}
        onChangeText={onChange}
        keyboardType={type || 'default'}
        secureTextEntry={secure || false}
      />
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
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabled: {
    backgroundColor: Colors.gray200,
  },
  invalidText: {
    fontSize: 12,
    color: Colors.red600,
    paddingLeft: 3
  }
})
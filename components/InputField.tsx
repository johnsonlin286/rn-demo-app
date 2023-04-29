import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

type Props = {
  label: string
  type?: 'default' | 'email-address' | 'number-pad' | 'phone-pad'
  secure?: boolean,
  value?: string
  onChange: (value: string) => void
  style?: ViewStyle
}

const InputField: React.FC<Props> = ({ label, type, secure, value, onChange, style }) => {
  return (
    <View style={style || null}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType={type || 'default'} secureTextEntry={secure || false} />
    </View>
  );
}

export default InputField;

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    paddingLeft: 0,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8
  }
})
import { StyleSheet, Text, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import Colors from "../utils/Colors";

type Props = {
  color: 'red' | 'green' | 'blue' | 'yellow',
  message: string,
  icon?: keyof typeof Ionicons.glyphMap,
}

const Alert: React.FC<Props> = ({ color, message, icon }) => {
  const alertColor = () => {
    switch (color) {
      case "red":
        return styles.red
      case "green":
        return styles.green
      case "blue":
        return styles.blue
      case "yellow":
        return styles.yellow
      default:
        return null
    }
  }
  return (
    <View style={styles.container}>
      <View style={[styles.alert, alertColor()]}>
        {icon && <Ionicons name={icon} size={20} color="white" style={styles.icon} />}
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

export default Alert;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: 10,
    left: 0,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderRadius: 6,
    padding: 16,
  },
  red: {
    backgroundColor: Colors.red500
  },
  green: {
    backgroundColor: Colors.green500
  },
  blue: {
    backgroundColor: Colors.sky500
  },
  yellow: {
    backgroundColor: Colors.yellow500
  },
  icon: {
    marginRight: 6
  },
  text: {
    color: 'white'
  }
});
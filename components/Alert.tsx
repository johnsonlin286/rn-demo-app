import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import Ionicons from '@expo/vector-icons/Ionicons';

import Colors from "../utils/Colors";
import { AlertContext } from "../store/context/alertContext";

const Alert = () => {
  const { isVisible, alertContent, hideAlert } = useContext(AlertContext);
  const offset = useSharedValue(-100);

  const animatedStyle = useAnimatedStyle(() => {
    const config = {
      duration: 500
    }
    return {
      transform: [{
        translateY: withTiming(offset.value, config)
      }]
    }
  }, [offset]);

  useEffect(() => {
    offset.value = 0
    const timeout = setTimeout(() => {
      offset.value = -100;
    }, 5000);
    const hideTimeout = setTimeout(() => {
      hideAlert();
    }, 5500);

    return () => {
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    }
  }, []);

  const alertColor = () => {
    switch (alertContent.color) {
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

  if (!isVisible) {
    return null
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.alert, alertColor(), animatedStyle]}>
        {alertContent.icon && <Ionicons name={alertContent.icon} size={20} color="white" style={styles.icon} />}
        <Text style={styles.text}>{alertContent.message}</Text>
      </Animated.View>
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
    zIndex: 9
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderRadius: 6,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 8,
    paddingHorizontal: 16
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
    fontSize: 12,
    color: 'white',
  }
});
import { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native"

import Colors from "../utils/Colors";

type Props = {
  text?: string;
  imgUri?: string;
  size?: 'sm' | 'lg'
}

const Avatar: React.FC<Props> = ({ text, imgUri, size }) => {
  const initials = useMemo(() => {
    if (text) {
      const initialsName: string[] = [];
      text.split(' ').forEach((item) => {
        if (initialsName.length < 2) {
          initialsName.push(item.charAt(0).toUpperCase())
        }
      });
      return initialsName.join('');
    }
  }, [text]);

  const sizeStyle = useMemo(() => {
    switch (size) {
      case "sm":
        return styles.sm
      case "lg":
        return styles.lg
      default:
        return styles.sm
    }
  }, [size]);

  const textSizeStyle = useMemo(() => {
    switch (size) {
      case "sm":
        return styles.text_sm
      case "lg":
        return styles.text_lg
      default:
        return styles.text_sm
    }
  }, [size]);

  return (
    <View style={[styles.avatar, sizeStyle]}>
      {
        imgUri && <Image source={{ uri: imgUri }} style={[sizeStyle]} />
      }
      {
        text && <Text style={[styles.text, textSizeStyle]}>{initials}</Text>
      }
    </View>
  )
}

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray300,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  sm: {
    width: 24,
    height: 24
  },
  lg: {
    width: 112,
    height: 112,
  },
  text: {
    fontWeight: 'bold',
  },
  text_sm: {
    fontSize: 12,
  },
  text_lg: {
    fontSize: 36,
  }
})
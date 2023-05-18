import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  icon: keyof typeof Ionicons.glyphMap,
  size?: number,
  color?: string,
  disabled?: boolean,
  style?: ViewStyle,
  onPress: () => void
}

const IconBtn: React.FC<Props> = ({ icon, size, color, disabled, style, onPress }) => {
  return (
    <Pressable style={[style, disabled ? styles.disabled : null]} disabled={disabled} onPress={onPress}>
      <Ionicons name={icon} size={size || 24} color={color || 'black'} />
    </Pressable>
  );
}

export default IconBtn;

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5
  }
});
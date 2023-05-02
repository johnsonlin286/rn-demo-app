import { Pressable, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  icon: keyof typeof Ionicons.glyphMap,
  size?: number,
  color?: string,
  style?: ViewStyle,
  onPress: () => void
}

const IconBtn: React.FC<Props> = ({ icon, size, color, style, onPress }) => {
  return (
    <Pressable style={[style]} onPress={onPress}>
      <Ionicons name={icon} size={size || 24} color={color || 'black'} />
    </Pressable>
  );
}

export default IconBtn;
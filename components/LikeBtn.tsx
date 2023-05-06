import { useEffect, useState } from "react";

import Colors from "../utils/Colors";
import IconBtn from "./IconBtn";

type Props = {
  size?: 'default' | 'sm',
  defaultValue: boolean,
  onPress: () => void
}

const LikeBtn: React.FC<Props> = ({ size, defaultValue, onPress }) => {
  const [like, setLike] = useState(false);

  useEffect(() => {
    setLike(defaultValue);
  }, [defaultValue]);

  return (
    <IconBtn icon={like ? 'md-heart-sharp' : 'md-heart-outline'} size={size === 'sm' ? 24 : 30} color={like ? Colors.red600 : 'black'} onPress={onPress} />
  );
}

export default LikeBtn;
import { useEffect, useState } from "react";

import Colors from "../utils/Colors";
import IconBtn from "./IconBtn";

type Props = {
  defaultValue: boolean,
  onPress: () => void
}

const LikeBtn: React.FC<Props> = ({ defaultValue, onPress }) => {
  const [like, setLike] = useState(false);

  useEffect(() => {
    setLike(defaultValue);
  }, [defaultValue]);

  return (
    <IconBtn icon={like ? 'md-heart-sharp' : 'md-heart-outline'} size={30} color={like ? Colors.red600 : 'black'} onPress={onPress} />
  );
}

export default LikeBtn;
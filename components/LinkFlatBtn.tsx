import { useCallback, useContext } from "react";
import { Linking, ViewStyle } from "react-native";

import { AlertContext } from "../store/context/alertContext";
import FlatButton from "./FlatBtn";

type Props = {
  title: string,
  url: string,
  style?: ViewStyle
}

const LinkFlatBtn = ({ title, url, style }: Props) => {
  const { setAlert } = useContext(AlertContext);

  const onPressedHandler = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      setAlert({ color: 'yellow', message: `Can't not open ${url}` });
    }
  }, [url]);

  return (
    <FlatButton title={title} onPress={onPressedHandler} style={style} />
  );
}

export default LinkFlatBtn;

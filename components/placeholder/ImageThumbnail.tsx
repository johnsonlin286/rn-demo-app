import SkeletonLoader from "expo-skeleton-loader";
import { useWindowDimensions } from "react-native";

import Colors from "../../utils/Colors";

const ImageThumbnail = () => {
  const { width } = useWindowDimensions();

  return (
    <SkeletonLoader boneColor={Colors.gray300} highlightColor={Colors.gray200} style={{ width: width / 3, height: 120, padding: 2 }}>
      <SkeletonLoader.Container style={{ flex: 1 }} >
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
}

export default ImageThumbnail;
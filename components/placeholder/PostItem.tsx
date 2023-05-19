import { useWindowDimensions } from "react-native";
import SkeletonLoader from "expo-skeleton-loader";

import Colors from "../../utils/Colors";

const PostItem = () => {
  const { width } = useWindowDimensions();

  return (
    <SkeletonLoader boneColor={Colors.gray300} highlightColor={Colors.gray200} style={{ borderBottomWidth: 1, borderBottomColor: Colors.gray300, paddingBottom: 16, marginBottom: 16 }}>
      <SkeletonLoader.Container>
        <SkeletonLoader.Item style={{ width: width - (16 * 2), height: 300, borderRadius: 10, marginBottom: 8 }} />
      </SkeletonLoader.Container>
      <SkeletonLoader.Container style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonLoader.Container style={{ flexDirection: 'row' }}>
          <SkeletonLoader.Item style={{ width: 30, height: 30, borderRadius: 6 }} />
          <SkeletonLoader.Item style={{ width: 30, height: 30, borderRadius: 6, marginLeft: 16 }} />
        </SkeletonLoader.Container>
        <SkeletonLoader.Container style={{ flexDirection: 'row' }}>
          <SkeletonLoader.Item style={{ width: 30, height: 30, borderRadius: 6 }} />
          <SkeletonLoader.Item style={{ width: 30, height: 30, borderRadius: 6, marginLeft: 16 }} />
        </SkeletonLoader.Container>
      </SkeletonLoader.Container>
      <SkeletonLoader.Container style={{ marginTop: 16 }}>
        <SkeletonLoader.Item style={{ width: 200, height: 15, borderRadius: 6 }} />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
}

export default PostItem;

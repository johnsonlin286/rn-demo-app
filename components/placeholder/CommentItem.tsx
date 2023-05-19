import { useWindowDimensions } from "react-native";
import SkeletonLoader from "expo-skeleton-loader";

import Colors from "../../utils/Colors";

const CommentItem = () => {
  return (
    <SkeletonLoader boneColor={Colors.gray300} highlightColor={Colors.gray200}>
      <SkeletonLoader.Container style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 16, marginBottom: 16 }}>
        <SkeletonLoader.Container style={{ flexDirection: 'row' }}>
          <SkeletonLoader.Item style={{ width: 24, height: 24, borderRadius: 9999 }} />
          <SkeletonLoader.Container>
            <SkeletonLoader.Item style={{ width: 200, height: 12, borderRadius: 6, marginHorizontal: 12, marginBottom: 12 }} />
            <SkeletonLoader.Item style={{ width: 40, height: 12, borderRadius: 6, marginHorizontal: 12 }} />
          </SkeletonLoader.Container>
        </SkeletonLoader.Container>
        <SkeletonLoader.Item style={{ width: 24, height: 24, borderRadius: 6 }} />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
}

export default CommentItem;
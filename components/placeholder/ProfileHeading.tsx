import { useWindowDimensions } from "react-native";
import SkeletonLoader from "expo-skeleton-loader";

import Colors from "../../utils/Colors";

const ProfileHeading = () => {
  return (
    <SkeletonLoader boneColor={Colors.gray300} highlightColor={Colors.gray200}>
      <SkeletonLoader.Container style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.gray300, paddingBottom: 16, marginTop: 8, marginBottom: 20 }}>
        <SkeletonLoader.Item style={{ width: 112, height: 112, borderRadius: 9999 }} />
        <SkeletonLoader.Item style={{ width: 28, height: 60, marginLeft: 20 }} />
        <SkeletonLoader.Item style={{ width: 28, height: 60, marginLeft: 20 }} />
        <SkeletonLoader.Item style={{ width: 28, height: 60, marginLeft: 20 }} />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
}

export default ProfileHeading;
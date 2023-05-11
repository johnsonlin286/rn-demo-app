import { StyleSheet, View, Text } from 'react-native';

import Colors from '../utils/Colors';
import Avatar from './Avatar';
import IconBtn from './IconBtn';

type Props = {
  userName: string,
  postCount: number,
  isOwnProfile?: boolean,
  onLogoutPress: () => void
}

const ProfileHeading: React.FC<Props> = ({ userName, postCount, isOwnProfile, onLogoutPress }) => {
  return (
    <View style={styles.heading}>
      <View style={styles.headingContent}>
        <Avatar text={userName || ''} size="lg" />
        <View style={styles.headingTextContainer}>
          <Text style={[styles.headingText, styles.headingTextLg]}>{postCount || 0}</Text>
          <Text style={[styles.headingText, styles.hedingTextMd]}>{`Post${postCount > 1 ? 's' : ''}`}</Text>
        </View>
      </View>
      {
        isOwnProfile && <IconBtn icon="log-out-outline" size={30} color={Colors.sky400} onPress={onLogoutPress} />
      }
    </View>
  );
}

export default ProfileHeading;

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    paddingBottom: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  headingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingTextContainer: {
    paddingHorizontal: 20,
  },
  headingText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headingTextLg: {
    fontSize: 28,
  },
  hedingTextMd: {
    fontSize: 18,
  }
})
import { Image, StyleSheet, Text, View } from "react-native";
import IconBtn from "./IconBtn";

type UserType = {
  _id: string,
  name: string,
}

type LikesType = {
  _id: string,
  user: UserType[],
}

type Props = {
  data: {
    _id: string,
    caption: string,
    imageUrl: string,
    likes: LikesType[],
    user: UserType,
  }
}

const PostItem: React.FC<Props> = ({ data }) => {
  const { _id, caption, imageUrl, likes, user } = data;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      <View style={styles.actions}>
        <IconBtn icon="md-heart-outline" size={30} onPress={() => null} style={styles.actionsIconLike} />
        <IconBtn icon="md-chatbubbles-outline" size={30} onPress={() => null} />
      </View>
      <Text style={styles.textLike}>{`${likes.length} Like${likes.length > 1 ? 's' : ''}`}</Text>
      <View style={styles.caption}>
        <Text style={[styles.textCaption, styles.textName]}>{`${user.name} `}</Text>
        <Text style={styles.textCaption}>{caption}</Text>
      </View>
    </View>
  );
}

export default PostItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
  },
  actionsIconLike: {
    marginRight: 16,
  },
  textLike: {
    paddingLeft: 8,
    marginBottom: 8,
  },
  caption: {
    flexDirection: 'row',
    paddingLeft: 8,
  },
  textCaption: {
    fontStyle: 'italic',
  },
  textName: {
    fontWeight: 'bold'
  }
});
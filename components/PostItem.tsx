import { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from "../utils/Colors";
import { AuthContext } from "../store/context/authContext";
import { likePost, dislikePost } from "../api/like";
import IconBtn from "./IconBtn";
import LikeBtn from "./LikeBtn";

type UserType = {
  _id: string,
  name: string,
}

type LikesType = {
  _id: string,
  user: UserType,
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
  const navigation = useNavigation<any>();
  const { isAuth, user: authUser } = useContext(AuthContext);
  const { _id, caption, imageUrl, likes, user } = data;
  const [likesCount, setLikesCount] = useState<Array<LikesType>>([]);
  const [liked, setLiked] = useState<string | undefined>();

  useEffect(() => {
    if (likes) setLikesCount(likes);
  }, [likes]);

  useEffect(() => {
    if (isAuth) {
      likesCount.forEach(item => {
        if (item.user._id === authUser?.id) {
          setLiked(item._id);
        }
      })
    }
  }, [isAuth, authUser, likesCount, setLiked]);

  const likeToggle = async () => {
    if (!isAuth) {
      navigation.navigate('Auth', { screen: 'Signin' });
      return;
    }
    if (!liked) {
      const like = await likePost(_id);
      setLikesCount((prev) => [...prev, like]);
      setLiked(like._id);
    } else {
      const dislike = await dislikePost(liked);
      setLikesCount(() => likesCount.filter(like => like._id !== dislike._id));
      setLiked(undefined);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      <View style={styles.actions}>
        <LikeBtn defaultValue={liked ? true : false} onPress={likeToggle} />
        <IconBtn icon="md-chatbubbles-outline" size={30} onPress={() => null} style={styles.actionsComment} />
      </View>
      {
        likesCount.length > 0 && (
          <Text style={styles.textLike}>{`${likesCount.length} Like${likesCount.length > 1 ? 's' : ''}`}</Text>
        )
      }
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
    borderBottomColor: Colors.gray300,
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
  actionsComment: {
    marginLeft: 16,
  },
  textLike: {
    paddingLeft: 8,
  },
  caption: {
    flexDirection: 'row',
    paddingLeft: 8,
    marginTop: 16,
  },
  textCaption: {
    fontStyle: 'italic',
  },
  textName: {
    fontWeight: 'bold'
  }
});
import { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from "../utils/Colors";
import { AuthContext } from "../store/context/authContext";
import { likePost, dislikePost } from "../api/like";
import IconBtn from "./IconBtn";
import LikeBtn from "./LikeBtn";
import { AlertContext } from "../store/context/alertContext";

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
  },
  onLoadComments: (id: string) => void,
  isOwnerPost?: boolean,
  onDelete?: (id: string) => void
}

const PostItem: React.FC<Props> = ({ data, onLoadComments, isOwnerPost, onDelete }) => {
  const navigation = useNavigation<any>();
  const { isAuth, user: authUser } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const { _id, caption, imageUrl, likes, user } = data;
  const [likesCount, setLikesCount] = useState<Array<LikesType>>([]);
  const [liked, setLiked] = useState<string | undefined>();

  useEffect(() => {
    if (likes) setLikesCount(likes);
  }, [likes]);

  useEffect(() => {
    if (isAuth) {
      likesCount.forEach(item => {
        if (item.user && item.user._id === authUser?.id) {
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
      try {
        const like = await likePost(_id);
        setLikesCount((prev) => [...prev, like]);
        setLiked(like._id);
      } catch (error) {
        setAlert({ color: 'red', message: 'Something went wrong!' });
      }
    } else {
      try {
        const dislike = await dislikePost(liked);
        setLikesCount(() => likesCount.filter(like => like._id !== dislike._id));
        setLiked(undefined);
      } catch (error) {
        setAlert({ color: 'red', message: 'Something went wrong!' });
      }
    }
  }

  const profileNavigation = () => {
    navigation.navigate('User', { id: user._id })
  }

  const deleteButtonHandler = () => {
    if (isOwnerPost && onDelete) onDelete(_id);
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <LikeBtn defaultValue={liked ? true : false} onPress={likeToggle} />
          <IconBtn icon="md-chatbubbles-outline" size={30} onPress={onLoadComments.bind(this, _id)} style={styles.actionsComment} />
        </View>
        {
          isOwnerPost && (
            <View style={styles.actionsRight}>
              <IconBtn icon="trash-bin" size={20} color={Colors.red600} onPress={deleteButtonHandler} />
              <IconBtn icon="pencil" size={20} color={Colors.sky400} onPress={() => navigation.navigate('Edit', { id: _id })} style={styles.actionsEdit} />
            </View>
          )
        }
      </View>
      {
        likesCount.length > 0 && (
          <Text style={styles.textLike}>{`${likesCount.length} Like${likesCount.length > 1 ? 's' : ''}`}</Text>
        )
      }
      <View style={styles.caption}>
        <Pressable onPress={!isOwnerPost ? profileNavigation : () => null}><Text style={[styles.textCaption, styles.textName]}>{`${user.name} `}</Text></Pressable>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsLeft: {
    flexDirection: 'row'
  },
  actionsRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionsComment: {
    marginLeft: 16,
  },
  actionsEdit: {
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
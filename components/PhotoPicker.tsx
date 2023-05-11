import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  useCameraPermissions,
  useMediaLibraryPermissions,
  PermissionStatus,
  MediaLibraryPermissionResponse,
  CameraPermissionResponse,
  launchImageLibraryAsync,
  launchCameraAsync,
} from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import Colors from "../utils/Colors";
import IconBtn from "./IconBtn";

const checkPermission = async (status: PermissionStatus | undefined, requestPermission: { (): Promise<MediaLibraryPermissionResponse | CameraPermissionResponse>; (): any; }) => {
  if (status === PermissionStatus.UNDETERMINED) {
    const permission = await requestPermission();
    return permission.granted
  }
  if (status === PermissionStatus.DENIED) {
    Alert.alert("Error Permission", "Denied Media or Camera access permission.");
    return false;
  }
  return true;
}

type ButtonProps = {
  onPicked: (uri: string) => void,
  onError: (errMsg: string) => void,
};

const CameraButton: React.FC<ButtonProps> = ({ onPicked, onError }) => {
  const [status, requestPermission] = useCameraPermissions();

  const openCamera = async () => {
    const hasPermission = await checkPermission(status?.status, requestPermission);
    if (!hasPermission) {
      return;
    }
    const picture = await launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (picture.assets !== null) {
      const file = picture.assets[0];
      const re = /(\.jpg|\.jpeg|\.png)$/i;
      if (file.uri && !re.exec(file.uri)) {
        onError('I ony accept .jpg, .jpeg, and .png file type.');
        return;
      }
      onPicked(file.uri);
      onError('');
    }
  }

  return (
    <IconBtn icon="camera" onPress={openCamera} size={30} color={Colors.sky400} style={styles.button} />
  )
}

const MediaButton: React.FC<ButtonProps> = ({ onPicked, onError }) => {
  const [status, requestPermission] = useMediaLibraryPermissions();

  const openMedia = async () => {
    const hasPermission = await checkPermission(status?.status, requestPermission);
    if (!hasPermission) {
      return;
    }
    const picture = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (picture.assets !== null) {
      const file = picture.assets[0];
      const re = /(\.jpg|\.jpeg|\.png)$/i;
      if (file.uri && !re.exec(file.uri)) {
        onError('I ony accept .jpg, .jpeg, and .png file type.');
        return;
      }
      onPicked(file.uri);
      onError('');
    }
  }

  return (
    <IconBtn icon="folder-open" onPress={openMedia} size={30} color={Colors.sky400} style={styles.button} />
  )
}

type Props = {
  defaultValue?: string,
  readonly?: boolean,
  onPicked: (uri: string) => void,
  isInvalid?: string,
}

const PhotoPicker: React.FC<Props> = ({ defaultValue, readonly, onPicked, isInvalid }) => {
  const [imagePreview, setImagePreview] = useState<string>();
  const [errMsg, setErrMsg] = useState<string>();

  useEffect(() => {
    if (defaultValue) { };
  }, [defaultValue]);

  useEffect(() => {
    if (!readonly && imagePreview) onPicked(imagePreview);
  }, [imagePreview, readonly])

  return (
    <>
      <View style={styles.container}>
        {
          imagePreview ? (
            <Image source={{ uri: imagePreview }} style={styles.image} />
          ) : (
            <>
              <Ionicons name="cloud-upload" color={Colors.sky400} size={80} />
              <Text>Upload Your Photo</Text>
            </>
          )
        }
      </View>
      {
        !readonly && (
          <View style={styles.bottom}>
            <Text style={styles.invalidText}>{isInvalid || errMsg || null}</Text>
            <View style={styles.buttons}>
              <CameraButton onPicked={setImagePreview} onError={setErrMsg} />
              <MediaButton onPicked={setImagePreview} onError={setErrMsg} />
            </View>
          </View>
        )
      }
    </>
  );
}

export default PhotoPicker;

const styles = StyleSheet.create({
  container: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: Colors.gray300,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.sky400,
    borderRadius: 6,
    padding: 4,
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: '100%'
  },
  invalidText: {
    fontSize: 12,
    color: Colors.red600,
    paddingLeft: 3
  }
})
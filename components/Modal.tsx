import { ReactNode } from "react";
import { StyleSheet, Modal as ReactNativeModal, View } from 'react-native';

import Colors from '../utils/Colors';

type Props = {
  isVisible: boolean,
  onDismiss: () => void,
  children: ReactNode,
}

const Modal: React.FC<Props> = ({ isVisible, onDismiss, children }) => {
  return (
    <ReactNativeModal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss}
      onDismiss={onDismiss}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalDialog}>
          {children}
        </View>
      </View>
    </ReactNativeModal>
  );
}

export default Modal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: `${Colors.black}50`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDialog: {
    maxWidth: 320,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    padding: 24,
    marginHorizontal: 30,
  },
})
import { StyleSheet, Modal, View, Text } from 'react-native';

import Colors from '../utils/Colors';
import Button from './Button';

type Props = {
  isVisible: boolean,
  onDismiss: () => void,
  onConfirm: () => void,
}

const LogoutModal: React.FC<Props> = ({ isVisible, onDismiss, onConfirm }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss}
      onDismiss={onDismiss}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalDialog}>
          <Text style={styles.modalText}>Are you sure want to signout?</Text>
          <View style={styles.modalButtons}>
            <Button title="Yes" outline onPress={onConfirm} style={styles.modalButton} />
            <Button title="cancel" onPress={onDismiss} style={styles.modalButton} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default LogoutModal;

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
  modalText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  }
})
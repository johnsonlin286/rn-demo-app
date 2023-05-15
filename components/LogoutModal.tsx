import { StyleSheet, View, Text } from 'react-native';

import Modal from './Modal';
import Button from './Button';

type Props = {
  isVisible: boolean,
  onDismiss: () => void,
  onConfirm: () => void,
}

const LogoutModal: React.FC<Props> = ({ isVisible, onDismiss, onConfirm }) => {
  return (
    <Modal
      isVisible={isVisible}
      onDismiss={onDismiss}
    >
      <Text style={styles.modalText}>Are you sure want to signout?</Text>
      <View style={styles.modalButtons}>
        <Button title="Yes" outline onPress={onConfirm} style={styles.modalButton} />
        <Button title="Cancel" onPress={onDismiss} style={styles.modalButton} />
      </View>
    </Modal>
  );
}

export default LogoutModal;

const styles = StyleSheet.create({
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
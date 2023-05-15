import { StyleSheet, View, Text } from "react-native";

import Modal from "./Modal";
import Button from "./Button";

type Props = {
  isVisible: boolean,
  onConfirm: () => void,
  onDismiss: () => void,
  deleting: boolean,
}

const DeleteModal: React.FC<Props> = ({ isVisible, onConfirm, onDismiss, deleting }) => {
  return (
    <Modal
      isVisible={isVisible}
      onDismiss={onDismiss}
    >
      <Text style={styles.modalText}>Are you sure want to delete this post?</Text>
      <View style={styles.modalButtons}>
        <Button title="Yes" disabled={deleting} outline onPress={onConfirm} style={styles.modalButton} />
        <Button title="Cancel" disabled={deleting} onPress={onDismiss} style={styles.modalButton} />
      </View>
    </Modal>
  );
}

export default DeleteModal;

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
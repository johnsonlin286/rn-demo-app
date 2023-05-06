import { StyleSheet, Text, View } from 'react-native';

import InputField from './InputField';
import Button from './Button';
import { useEffect, useState } from 'react';
import IconBtn from './IconBtn';

type Props = {
  userName: string,
  replyingTo?: string,
  onSubmit: (message: string) => void
  cancelReply: () => void
}

const CommentForm: React.FC<Props> = ({ userName, replyingTo, onSubmit, cancelReply }) => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (replyingTo) setMessage(`@${replyingTo} `);
  }, [replyingTo, setMessage]);

  const onSubmitHandler = () => {
    if (message.trim().length <= 0) {
      return;
    }
    onSubmit(message);
    setMessage('');
  }

  return (
    <View style={styles.container}>
      {
        replyingTo && (
          <View style={styles.replyNote}>
            <Text>{`Replying to ${replyingTo}`}</Text>
            <IconBtn icon="close" size={14} onPress={cancelReply} style={{ marginRight: 8 }} />
          </View>
        )
      }
      <View style={styles.formContainer}>
        <InputField value={message} placeholder={`Comment as ${userName}`} style={styles.input} onChange={setMessage} />
        <Button title="Reply" onPress={onSubmitHandler} />
      </View>
    </View>
  );
}

export default CommentForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  replyNote: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    marginRight: 8,
  }
})
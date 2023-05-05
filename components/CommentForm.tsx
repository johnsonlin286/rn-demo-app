import { StyleSheet, View } from 'react-native';

import InputField from './InputField';
import Button from './Button';
import { useState } from 'react';

type Props = {
  userName: string,
  onSubmit: (message: string) => void
}

const CommentForm: React.FC<Props> = ({ userName, onSubmit }) => {
  const [message, setMessage] = useState<string>('');

  const onSubmitHandler = () => {
    if (message.trim().length <= 0) {
      return;
    }
    onSubmit(message);
    setMessage('');
  }

  return (
    <View style={styles.container}>
      <InputField value={message} placeholder={`Comment as ${userName}`} style={styles.input} onChange={setMessage} />
      <Button title="Reply" onPress={onSubmitHandler} />
    </View>
  );
}

export default CommentForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    marginRight: 8,
  }
})
import React, { ComponentProps } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type Props = {
  label: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

type OnChangeText = ComponentProps<typeof TextInput>['onChangeText']

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
  },
  textInput: {
    borderColor: '#222',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFF',
    minHeight: 100,
  },
});

const TextArea = ({ label, text, setText}: Props) => {
  const onChangeText: OnChangeText = (changedText) => {
    setText(changedText);
  };

  return (
    <View>
      {!!label && (
        <Text style={styles.text}>
          {label}
        </Text>
      )}
      <TextInput
        value={text}
        style={styles.textInput}
        multiline
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

export default TextArea;

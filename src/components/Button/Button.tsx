import React, { ComponentProps } from 'react';
import { Pressable, Text, ViewStyle, PressableStateCallbackType, StyleProp, ActivityIndicator, StyleSheet } from 'react-native';
import { accent } from '../../core/colors';
import Color from 'color';

type PressProps = ComponentProps<typeof Pressable>

type Props = {
  text: string;
  onPress: PressProps['onPress'];
  disabled?: PressProps['disabled'];
  loading?: boolean;
  color?: keyof typeof accent;
}

type PressableStateCallback = {
  pressed: PressableStateCallbackType['pressed'];
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pressStyle = (disabled: Props['disabled'], loading: Props['loading'], backgroundColor: string) => ({ pressed }: PressableStateCallback): StyleProp<ViewStyle> => ({
  width: '100%',
  height: 50,
  backgroundColor: loading || disabled ? '#DDD' : pressed ? Color(backgroundColor).darken(0.2).hex() : backgroundColor,
  alignItems: 'center',
  justifyContent: 'center',
});

const Button = ({ text, onPress, disabled , loading, color }: Props) => {
  const style = pressStyle(disabled, loading, accent[color || 'INFO']);

  const textColor = disabled ? '#999' : color === 'WHITE' ? accent.INFO : accent.WHITE;

  return (
    <Pressable
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color="#888"
          size={24}
        />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>
          {text}
        </Text>
      )}

    </Pressable>
  );
};

export default Button;

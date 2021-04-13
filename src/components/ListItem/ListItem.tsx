import React, { ComponentProps, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { accent } from '../../core/colors';

type PressableStyle = ComponentProps<typeof Pressable>['style'];

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    height: 50,
    width: '100%',
  },
  editRow: {
    height: '100%',
    flexDirection: 'row',
  },
  buttonAdd: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  titleText: {
    fontSize: 18,
  },
  subtitleText: {
    color: '#222',
  },
});

const pressedStyle: PressableStyle = ({ pressed }) => ({
  backgroundColor: pressed ? accent.DISABLED : 'rgba(255, 255, 255, 0.3)',
});

type EditRowProps = {
  onEditPress: () => void;
  onCompletePress: () => void;
}

const EditRow = ({ onEditPress, onCompletePress }: EditRowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Pressable
        onPress={() => {
          setIsOpen(true);
        }}
        style={({ pressed }) => ({
          backgroundColor: pressed ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
        })}
      >
        <View style={styles.buttonAdd}>
          <Icon
            name="chevron-left"
            color="#222"
            size={24}
          />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.editRow}>
      <Pressable
        onPress={() => {
          onEditPress();
          setIsOpen(false);
        }}
        style={pressedStyle}
      >
        <View style={styles.buttonAdd}>
          <Icon
            name="edit"
            color={accent.INFO}
            size={24}
          />
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          onCompletePress();
          setIsOpen(false);
        }}
        style={pressedStyle}
      >
        <View style={styles.buttonAdd}>
          <Icon
            name="check-square"
            color={accent.SUCCESS}
            size={24}
          />
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          setIsOpen(false);
        }}
        style={pressedStyle}
      >
        <View style={styles.buttonAdd}>
          <Icon
            name="chevron-right"
            color="#222"
            size={24}
          />
        </View>
      </Pressable>
    </View>
  );
};

type Props = {
  title: string;
  subtitle: string;
  backgroundColor: ViewStyle['backgroundColor'];
  onEditPress: () => void;
  onCompletePress: () => void;
}

const ListItem = ({ title, subtitle, backgroundColor, onEditPress, onCompletePress }: Props) => {
  return (
    <View style={[styles.root, { backgroundColor }]}>
      <View>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
      </View>
      <EditRow
        onEditPress={onEditPress}
        onCompletePress={onCompletePress}
      />
    </View>
  );
};

export default ListItem;

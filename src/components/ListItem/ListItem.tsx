import React, { ComponentProps, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextStyle } from 'react-native';
import { ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { accent } from '../../core/colors';

type PressableStyle = ComponentProps<typeof Pressable>['style'];
type IconProps = ComponentProps<typeof Icon>;

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
  options: {
    onPress: () => void;
    iconName: IconProps['name'];
    iconColor: IconProps['color'];
  }[];
}

const EditRow = ({ options }: EditRowProps) => {
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
      {options.map(x => (
        <Pressable
          key={x.iconName}
          onPress={() => {
            x.onPress();
            setIsOpen(false);
          }}
          style={pressedStyle}
        >
          <View style={styles.buttonAdd}>
            <Icon
              name={x.iconName}
              color={x.iconColor}
              size={24}
            />
          </View>
        </Pressable>
      ))}
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
  options: EditRowProps['options'];
  textStyle?: TextStyle;
}

const ListItem = ({ title, subtitle, backgroundColor, options, textStyle }: Props) => {
  return (
    <View style={[styles.root, { backgroundColor }]}>
      <View>
        <Text style={[styles.titleText, textStyle]}>{title}</Text>
        <Text style={[styles.subtitleText, textStyle]}>{subtitle}</Text>
      </View>
      <EditRow
        options={options}
      />
    </View>
  );
};

export default ListItem;

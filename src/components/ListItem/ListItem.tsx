import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ViewStyle } from 'react-native';

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
    backgroundColor: 'yellow',
  },
  buttonAdd: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    backgroundColor: 'skyblue',
  },
  titleText: {
    fontSize: 18,
  },
  subtitleText: {
    color: '#222',
  },
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
      >
        <View style={styles.buttonAdd}>
          <Text>Menu</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.editRow}>
      <Pressable onPress={() => {
        onEditPress();
        setIsOpen(false);
      }}
      >
        <View style={styles.buttonAdd}>
          <Text>Edit</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => {
        onCompletePress();
        setIsOpen(false);
      }}
      >
        <View style={styles.buttonAdd}>
          <Text>Complete</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          setIsOpen(false);
        }}
      >
        <View style={styles.buttonAdd}>
          <Text>Close</Text>
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

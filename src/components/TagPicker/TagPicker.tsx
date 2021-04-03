import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';
import { Picker } from '@react-native-community/picker';
import type { RootState } from '../../core/redux/store';
import Button from '../Button';
import { accent } from '../../core/colors';

type Tag = RootState['challenges']['challenges'][0]['tags'][0]

type Props = {
  tagChoices: Tag[];
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const styles = StyleSheet.create({
  firstRow: {
    flexDirection: 'row',
  },
  tagsWrapper: {
    marginTop: 5,
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: '#222',
    borderWidth: 2,
  },
  tagWrapper: {
    height: 50,
    flexDirection: 'row',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  tagText: {
    maxWidth: 100,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderColor: '#222',
    borderWidth: 2,
    backgroundColor: 'pink',
  },
  pickerAndLabelWrapper: {
    flex: 1,
  },
  buttonWrapper: {
    width: 120,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    margin: 2,
    marginLeft: 10,
  },
  removeTagText: {
    fontWeight: 'bold',
    color: '#222',
  },
});

const TagPicker = ({ tagChoices, tags, setTags }: Props) => {
  const [selectedTag, setSelectedTag] = useState('');

  const removeTagPressStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => ({
    padding: 0,
    marginLeft: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: pressed ? accent.WARN : 'pink',
  });

  return (
    <View>
      <View style={styles.firstRow}>
        <View style={styles.pickerAndLabelWrapper}>
          <Text style={styles.label}>
            Tags
          </Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedTag}
              prompt="Select Tag"
              mode="dropdown"
              onValueChange={itemValue => {
                setSelectedTag(itemValue as string);
              }}
            >
              <Picker.Item
                label=""
                value=""
              />
              {tagChoices.map(x => (
                <Picker.Item
                  key={x.id}
                  label={x.name}
                  value={x.id}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            disabled={!selectedTag}
            onPress={() => {
              if (!selectedTag) {
                return;
              }
              const newTag = tagChoices.find(x => x.id === selectedTag);
              if (!newTag) {
                return;
              }
              const newTags = [
                ...tags,
                newTag,
              ];
              setTags(newTags);
              setSelectedTag('');
            }}
            text="ADD"
          />
        </View>
      </View>
      <View style={styles.tagsWrapper}>
        {tags.map(x => (
          <View
            key={x.id}
            style={styles.tagWrapper}
          >
            <Text
              numberOfLines={1}
              style={styles.tagText}
            >
              {x.name}
            </Text>
            <Pressable
              style={removeTagPressStyle}
              onPress={() => {
                const newTags = tags.filter(y => y.id !== x.id);
                setTags(newTags);
              }}
            >
              <Text style={styles.removeTagText}>
                x
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TagPicker;

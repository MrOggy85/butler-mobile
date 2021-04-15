import { DateTime } from 'luxon';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, StyleProp, ViewStyle } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useSelector } from 'react-redux';
import { RootState } from '../../core/redux/store';

type Task = RootState['task']['tasks'][0];

type OwnProps = {};
type Props = OwnProps;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listItem: {
    justifyContent: 'center',
    paddingLeft: 15,
    height: 100,
    borderBottomWidth: 0.5,
  },
  listItemTitle: {
    fontSize: 18,
  },
  listItemDescription: {
    color: '#222',
  },
});

const TaskScreen: FunctionComponent<Props> = ({}: Props) => {
  const tasks = useSelector(state => state.task.tasks);
  const [data, setData] = useState<Task[]>([]);

  useEffect(() => {
     setData(tasks);
  }, [tasks]);

  const renderItem = useCallback(({ item, index, drag, isActive }: RenderItemParams<Task>) => {
    const backgroundColor = isActive ? '#99D1F8' : '#99DEF0';
    const shadowStyle: StyleProp<ViewStyle> = isActive ? {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
    } : undefined;
    return (
      <Pressable
        style={[
          styles.listItem,
          {
            backgroundColor,
          },
          shadowStyle,
        ]}
        onLongPress={drag}
      >
        <View>
          <Text style={styles.listItemTitle}>
            {item.title}
          </Text>
          <Text style={styles.listItemDescription}>
            {item.description}
          </Text>
          <Text style={styles.listItemDescription}>
            {`start: ${DateTime.fromISO(item.startDate).toFormat('yyyy-mm-dd')} end: ${DateTime.fromISO(item.endDate).toFormat('yyyy-mm-dd')}`}
          </Text>
        </View>
      </Pressable>
    );
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.id}`}
        onDragEnd={({ data: newData }) => setData(newData)}
        activationDistance={20}

      />
    </SafeAreaView>
  );
};

export default TaskScreen;

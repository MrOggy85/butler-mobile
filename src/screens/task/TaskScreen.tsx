import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NavigationComponentProps, NavigationFunctionComponent } from 'react-native-navigation';

type OwnProps = {};
type Props = OwnProps;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

const TaskScreen: FunctionComponent<Props> = ({}: Props) => {
  return (
    <View>
      <Text>Task List</Text>
    </View>
  );
}

export default TaskScreen;

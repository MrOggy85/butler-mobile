import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { NavigationComponentProps, NavigationFunctionComponent } from 'react-native-navigation';
import PagerView from 'react-native-pager-view';
import TaskScreen from '../task/TaskScreen';
import HomeScreen from '../home/HomeScreen';
import CalendarScreen from '../calendar/CalendarScreen';

type OwnProps = {};
type Props = OwnProps & NavigationComponentProps;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

const MainScreen: NavigationFunctionComponent<Props> = ({ componentId }: Props) => {

  return (
    <PagerView
      style={styles.pagerView}
      initialPage={1}
    >
      <View key="1">
        <TaskScreen />
      </View>
      <View key="2">
        <HomeScreen componentId={componentId} />
      </View>
      <View key="2">
        <CalendarScreen />
      </View>
    </PagerView>
  );
};

export default MainScreen;

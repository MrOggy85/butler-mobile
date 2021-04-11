import React, { ComponentProps } from 'react';
import { View, StyleSheet } from 'react-native';
import { Navigation, NavigationComponentProps, NavigationFunctionComponent } from 'react-native-navigation';
import PagerView from 'react-native-pager-view';
import TaskScreen from '../task/TaskScreen';
import HomeScreen from '../home/HomeScreen';
import CalendarScreen from '../calendar/CalendarScreen';
import useTopBar from '../../core/navigation/useTopBar';
import { showModal } from '../../core/navigation/showModal';
import AddScreen from '../add/AddModal';

type AddScreenProps = Omit<ComponentProps<typeof AddScreen>, keyof NavigationComponentProps>

type OwnProps = {};
type Props = OwnProps & NavigationComponentProps;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

const titles = ['Tasks', 'Agenda', 'Calendar'];
let currentPage = 1;

const MainScreen: NavigationFunctionComponent<Props> = ({ componentId }: Props) => {
  useTopBar((e) => {
    if (e.buttonId === 'TOP_BAR_ADD_BUTTON') {
      const suggestAddType = currentPage === 2 ? 'EVENT' : 'TASK';

      showModal<AddScreenProps>({
        screen: 'ADD',
        title: '',
        passProps: {
          suggestAddType,
        },
      });
    }
  });
  return (
    <PagerView
      style={styles.pagerView}
      initialPage={currentPage}
      onPageSelected={(e) => {
        const title = titles[e.nativeEvent.position];
        currentPage = e.nativeEvent.position;

        Navigation.mergeOptions(componentId, {
          topBar: {
            title: {
              text: title,
            },
            rightButtons: [
              {
                id: 'TOP_BAR_ADD_BUTTON',
                text: 'ADD',
              },
            ],
          },
        });
      }}
    >
      <View key="1">
        <TaskScreen />
      </View>
      <View key="2">
        <HomeScreen componentId={componentId} />
      </View>
      <View key="3">
        <CalendarScreen />
      </View>
    </PagerView>
  );
};

export default MainScreen;

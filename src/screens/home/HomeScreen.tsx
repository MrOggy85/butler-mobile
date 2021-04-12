import React, { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView, ViewStyle, RefreshControl, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationComponentProps, NavigationFunctionComponent } from 'react-native-navigation';
import { DateTime } from 'luxon';
import { showModal } from '../../core/navigation/showModal';
import { loadTask } from '../../core/redux/taskReducer';
import type { Event, Task } from '../../core/redux/types';
import { loadEvents } from '../../core/redux/eventReducer';
import ListItem from '../../components/ListItem';
import AddScreen from '../add/AddModal';
import { accent } from '../../core/colors';

type OwnProps = {};
type Props = OwnProps & NavigationComponentProps;

type AddScreenProps = Omit<ComponentProps<typeof AddScreen>, keyof NavigationComponentProps>

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke',
  },
  mainContent: {
    flex: 1,
    width: '100%',
  },
  headerListItem: {
    height: 20,
    justifyContent: 'center',
    width: '100%',
    paddingLeft: 10,
  },
  nothingListItem: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 10,
  },
  nothingListItemText: {
    fontStyle: 'italic',
  },
  bottomContent: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  buttonAdd: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    backgroundColor: 'skyblue',
  },
  loadMoreDateWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreDateText: {
    fontSize: 16,
  },
  scrollView: {
    backgroundColor: '#FFF',
  },
  activityIndicatorHide: {
    opacity: 0,
  },
});

type BottonButtonProps = {
  text: string;
  isActive: boolean;
  activeBackgroundColor: ViewStyle['backgroundColor'];
  onPress: ComponentProps<typeof Pressable>['onPress'];
}

const BottomButton: FunctionComponent<BottonButtonProps> = ({ text, isActive, activeBackgroundColor, onPress }) => {
  const backgroundColor = isActive ? activeBackgroundColor : '#CCC';
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.bottomButton, { backgroundColor }]}>
        <Text>
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

type RenderListItemParams = {
  key: string;
  item: Task | Event;
  backgroundColor: ViewStyle['backgroundColor'];
}

function renderListItem({ key, item, backgroundColor }: RenderListItemParams) {
  const onEditPress = () => {
    showModal<AddScreenProps>({
      screen: 'ADD',
      title: '',
      passProps: {
        id: item.id,
      },
    });
  };
  const onCompletePress = () => {
    showModal<AddScreenProps>({
      screen: 'ADD',
      title: '',
      passProps: {
        id: item.id,
      },
    });
  };

  return (
    <ListItem
      key={key}
      title={item.title}
      subtitle={item.description}
      backgroundColor={backgroundColor}
      onEditPress={onEditPress}
      onCompletePress={onCompletePress}
    />
  );
}

type HeaderListItemProps = {
  text: string;
  backgroundColor?: ViewStyle['backgroundColor'];
}

const HeaderListItem: FunctionComponent<HeaderListItemProps> = ({ text, backgroundColor }) => {
  return (
    <View style={[styles.headerListItem, { backgroundColor }]}>
      <Text>
        {text}
      </Text>
    </View>
  );
};

type NothingListItemProps = {
  text: string;
  date: Date;
}

const NothingListItem: FunctionComponent<NothingListItemProps> = ({ text, date }) => {
  const onPress = () => {
    showModal<AddScreenProps>({
      screen: 'ADD',
      title: '',
      passProps: {
        suggestedStartDate: date,
      },
    });
  };

  return (
    <View style={styles.nothingListItem}>
      <Text style={styles.nothingListItemText}>
        {text}
      </Text>
      <Pressable onPress={onPress}>
        <View style={styles.buttonAdd}>
          <Text>Add</Text>
        </View>
      </Pressable>
    </View>
  );
};

const HomeScreen: NavigationFunctionComponent<Props> = ({ componentId }: Props) => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.task.tasks);
  const events = useSelector(state => state.event.events);
  const [taskActive, setTaskActive] = useState(false);
  const [eventActive, setEventActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [daysInView, setDaysInView] = useState(20);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isBottomRefreshing, setIsBottomRefreshing] = useState(false);

  useEffect(() => {
    dispatch(loadTask());
    dispatch(loadEvents());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTaskPress = () => {
    setTaskActive(!taskActive);
  };
  const onEventPress = () => {
    setEventActive(!eventActive);
  };

  const listItems = [];
  const now = DateTime.now();
  for (let index = 0; index < daysInView; index++) {
    const dayPlusMinus = index + currentDayIndex;
    const date = dayPlusMinus >= 0
      ? now.plus({ day: dayPlusMinus })
      : now.plus({ day: dayPlusMinus });

    const isToday = dayPlusMinus === 0;
    const header = (
      <HeaderListItem
        key={`header-${index}`}
        text={`${date.toFormat('yyyy-MM-dd')}${isToday ? ' - Today' : ''}`}
        backgroundColor={isToday ? accent.HIGHLIGHT : '#DDD'}
      />
    );
    listItems.push(header);

    const tasksOfTheDay = taskActive ? tasks.filter(x => {
      const taskDate = DateTime.fromMillis(x.startDate);
      return date.hasSame(taskDate, 'day');
    }) : [];

    const eventsOfTheDay = eventActive ? events.filter(x => {
      const eventDate = DateTime.fromMillis(x.startDate);
      return date.hasSame(eventDate, 'day');
    }) : [];

    if (tasksOfTheDay.length === 0 && eventsOfTheDay.length === 0) {
      listItems.push((
        <NothingListItem
          date={date.toJSDate()}
          text="Nothing"
          key={`header-${index}-empty`}
        />
      ));
    } else {
      const taskListItems = tasksOfTheDay.map(x => (
        renderListItem({
          key: `task-${x.id}`,
          item: x,
          backgroundColor: accent.TASK,
        })
      ));
      const eventListItems = eventsOfTheDay.map(x => (
        renderListItem({
          key: `event-${x.id}`,
          item: x,
          backgroundColor: accent.EVENT,
        })
      ));

      listItems.push(...taskListItems, ...eventListItems, (
        <NothingListItem
          key={`header-${index}-empty`}
          text=""
          date={date.toJSDate()}
        />
      ));
    }
  }

  const onRefresh = () => {
    setCurrentDayIndex(currentDayIndex - 5);
    setDaysInView(daysInView + 5);
  };

  const onBottomPull = () => {
    setDaysInView(daysInView + 5);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View style={styles.mainContent}>
          <View style={styles.loadMoreDateWrapper}>
            <Text style={styles.loadMoreDateText}>
              {isBottomRefreshing ? 'Release to load more dates' : 'Pull to load more dates'}
            </Text>
            <ActivityIndicator style={isBottomRefreshing ? undefined : styles.activityIndicatorHide} />
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
              />
            }
            onScroll={(e) => {
              const scrollViewHeight = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height;
              const currentOffset = e.nativeEvent.contentOffset.y;
              const threashhold = 120;
              if (currentOffset > scrollViewHeight + threashhold) {
                if (!isBottomRefreshing) {
                  setIsBottomRefreshing(true);
                }
              } else {
                if (isBottomRefreshing) {
                  setIsBottomRefreshing(false);
                }
              }
            }}
            scrollEventThrottle={32}
            onScrollEndDrag={(e) => {
              const scrollViewHeight = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height;
              const currentOffset = e.nativeEvent.contentOffset.y;
              const threashhold = 120;
              if (currentOffset > scrollViewHeight + threashhold) {
                onBottomPull();
              }
            }}
          >
            {listItems}
          </ScrollView>

        </View>
        <View style={styles.bottomContent}>
          <BottomButton
            text="Tasks"
            isActive={taskActive}
            activeBackgroundColor={accent.TASK}
            onPress={onTaskPress}
          />
          <BottomButton
            text="Events"
            isActive={eventActive}
            activeBackgroundColor={accent.EVENT}
            onPress={onEventPress}
          />
          <BottomButton
            text="Priority"
            isActive={false}
            activeBackgroundColor={accent.HIGHLIGHT}
            onPress={() => {}}
          />
          <BottomButton
            text="Tags"
            isActive={false}
            activeBackgroundColor={accent.HIGHLIGHT}
            onPress={() => {}}
          />
          <BottomButton
            text="Profile"
            isActive={false}
            activeBackgroundColor={accent.HIGHLIGHT}
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

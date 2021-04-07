import React, { ComponentProps, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, SafeAreaView, ScrollView, ViewStyle, RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import { Navigation, NavigationComponentProps, NavigationFunctionComponent } from 'react-native-navigation';
import { events } from '../../../mockData/data';
import { DateTime } from 'luxon';
import { showModal } from '../../core/navigation/showModal';
import { useDispatch, useSelector } from 'react-redux';
import { loadTask } from '../../core/redux/taskReducer';
import AddScreen from '../add/AddModal';
import { Event, Task } from '../../core/redux/types';

type OwnProps = {};
type Props = OwnProps & NavigationComponentProps;

type AddScreenProps = Omit<ComponentProps<typeof AddScreen>, keyof NavigationComponentProps>

const COLOR_TASK = '#99DEF0';
const COLOR_EVENTS = '#ffc425';
const COLOR_GREEN = '#00b159';
const COLOR_RED = '#d11141';
const COLOR_ORANGE = '#f37735';

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
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    height: 50,
    width: '100%',
  },
  headerListItem: {
    height: 20,
    justifyContent: 'center',
    width: '100%',
    paddingLeft: 10,
    // backgroundColor: '#DDD',
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
  editRow: {
    // flex: 1,
    // width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: 'yellow',
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

type ListItemProps = {
  item: Task | Event;
  backgroundColor: ViewStyle['backgroundColor'];
  onPress: ComponentProps<typeof Pressable>['onPress'];
}

const ListItem: FunctionComponent<ListItemProps> = ({ item, backgroundColor, onPress }) => {
  const [isEdit, setIsEdit] = useState(false);

  const onEditPress = () => {
    showModal<AddScreenProps>({
      screen: 'ADD',
      title: 'Add',
      passProps: {
        id: item.id,
      },
    });
  };

  return (
    <View style={[styles.listItem, { backgroundColor }]}>
      <Text>
        {item.title}
      </Text>
      {isEdit ? (
        <View style={styles.editRow}>
          <Pressable onPress={onEditPress}>
            <View style={styles.buttonAdd}>
              <Text>
                Edit
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={onPress}>
            <View style={styles.buttonAdd}>
              <Text>
                Complete
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsEdit(false);
            }}
          >
            <View style={styles.buttonAdd}>
              <Text>
                Close
              </Text>
            </View>
          </Pressable>
        </View>
      ): (
        <Pressable
          onPress={() => {
            setIsEdit(true);
          }}
        >
          <View style={styles.buttonAdd}>
            <Text>
              Menu
            </Text>
          </View>
        </Pressable>
      )}

    </View>
  );
};

type HeaderListItemProps = {
  text: string;
  backgroundColor?: ViewStyle['backgroundColor'];
}

const HeaderListItem: FunctionComponent<HeaderListItemProps> = ({ text, backgroundColor }) => {
  // const backgroundColor = isActive ? 'yellow' : '#CCC';
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
      title: 'Add',
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
          <Text>
            Add
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const HomeScreen: NavigationFunctionComponent<Props> = ({ componentId }: Props) => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.task.tasks);
  const [taskActive, setTaskActive] = useState(false);
  const [eventActive, setEventActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [daysInView, setDaysInView] = useState(20);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isBottomRefreshing, setIsBottomRefreshing] = useState(false);

  useEffect(() => {
    dispatch(loadTask());
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
        backgroundColor={isToday ? COLOR_ORANGE : '#DDD'}
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
        <ListItem
          key={`task-${x.id}`}
          item={x}
          backgroundColor={COLOR_TASK}
          onPress={() => {}}
        />
      ));
      const eventListItems = eventsOfTheDay.map(x => (
        <ListItem
          key={`event-${x.id}`}
          item={x}
          backgroundColor={COLOR_EVENTS}
          onPress={() => {}}
        />
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
            activeBackgroundColor={COLOR_TASK}
            onPress={onTaskPress}
          />
          <BottomButton
            text="Events"
            isActive={eventActive}
            activeBackgroundColor={COLOR_EVENTS}
            onPress={onEventPress}
          />
          <BottomButton
            text="Priority"
            isActive={false}
            activeBackgroundColor={COLOR_ORANGE}
            onPress={() => {}}
          />
          <BottomButton
            text="Tags"
            isActive={false}
            activeBackgroundColor={COLOR_ORANGE}
            onPress={() => {}}
          />
          <BottomButton
            text="Profile"
            isActive={false}
            activeBackgroundColor={COLOR_ORANGE}
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

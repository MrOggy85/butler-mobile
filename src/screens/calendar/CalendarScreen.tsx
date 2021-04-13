import { DateTime } from 'luxon';
import React, { ComponentProps, FunctionComponent, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { NavigationComponentProps } from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { showModal } from '../../core/navigation/showModal';
import { RootState } from '../../core/redux/store';
import AddScreen from '../add/AddModal';

type Event = RootState['event']['events'][0];
type AddScreenProps = Omit<ComponentProps<typeof AddScreen>, keyof NavigationComponentProps>

type OwnProps = {};
type Props = OwnProps;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  root: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  calendarRow: {
    flexDirection: 'row',
  },
  calendarDayWrapper: {
    flex: 1,
    height: 20,
    backgroundColor: '#FFE',
    borderBottomWidth: 0.5,
  },
  calendarCell: {
    flex: 1,
    minHeight: 100,
    backgroundColor: 'pink',
    borderBottomWidth: 0.5,
  },
  eventItemWrapper: {
    backgroundColor: '#ffc425',
    borderBottomWidth: 0.5,
  },
  eventItemText: {
    fontSize: 11,
  },
  zoomedCalendarCellWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedCalendarCellContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#FFF',
  },
  zoomedHourWrapper: {
    flex: 1,
  },
  zoomedHour: {
    minHeight: 10,
    borderBottomWidth: 0.5,
  },
  buttonAdd: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    backgroundColor: 'skyblue',
  },
});

const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const hours = Array.from(Array(24));

type DateCell = {
  month: number;
  day: number;
  key: string;
  events: Event[];
}

function getEventsOfTheDay(date: DateTime, events: Event[]) {
  const eventsOfTheDay = events.filter(x => {
    const eventDate = DateTime.fromISO(x.startDate);
    return date.hasSame(eventDate, 'day');
  });
  return eventsOfTheDay;
}

const CalendarScreen: FunctionComponent<Props> = ({}: Props) => {
  const listItems: DateCell[][] = [];
  const events = useSelector(state => state.event.events);
  const [zoomedDate, setZoomedDate] = useState<DateTime | undefined>(undefined);

  const now = DateTime.now();
  const firstDayOfCurrentMonth = DateTime.fromObject({ year: now.year, month: now.month, day: 1 });
  const lastDayOfPreviousMonth = firstDayOfCurrentMonth.minus({ day: 1 }).day;

  let currentDate = firstDayOfCurrentMonth.plus({ day: 0 });

  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    const row: DateCell[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      if (rowIndex === 0) {
        if (dayIndex >= firstDayOfCurrentMonth.weekday - 1) {
          const eventsOfTheDay = getEventsOfTheDay(currentDate, events);
          row.push({
            key: `${rowIndex}-${currentDate.day}`,
            month: firstDayOfCurrentMonth.month,
            day: currentDate.day,
            events: eventsOfTheDay,
          });
          currentDate = currentDate.plus({ day: 1 });
        } else {
          const dd = lastDayOfPreviousMonth - (firstDayOfCurrentMonth.weekday - 2 - dayIndex);
          const date = DateTime.fromObject({
            year: currentDate.year,
            month: currentDate.month - 1,
            day: dd,
          });
          const eventsOfTheDay = getEventsOfTheDay(date, events);
          row.push({
            key: `${rowIndex}-${dd}`,
            month: firstDayOfCurrentMonth.minus({ month: 1}).month,
            day: dd,
            events: eventsOfTheDay,
          });
        }
      } else {
        const eventsOfTheDay = getEventsOfTheDay(currentDate, events);
        row.push({
          key: `${rowIndex}-${currentDate.day}`,
          month: currentDate.month,
          day: currentDate.day,
          events: eventsOfTheDay,
        });
        currentDate = currentDate.plus({ day: 1 });
      }
    }
    listItems.push(row);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.row}>
        {weekDays.map(x => {
          return (
            <View
              key={x}
              style={styles.calendarDayWrapper}
            >
              <Text>
                {x}
              </Text>
            </View>
          );
        })}
      </View>

      <ScrollView>
        <View style={styles.root}>
          {listItems.map((x, i) => {
              return (
                <View
                  key={i}
                  style={styles.calendarRow}
                >
                  {x.map(y => {
                    const backgroundColor = now.month === y.month
                      ? '#FFF'
                      : '#EEE';

                    const fontWeight = now.toLocal().day === y.day
                      ? 'bold'
                      : 'normal';
                    return (
                      <Pressable
                        key={y.key}
                        style={[styles.calendarCell, { backgroundColor }]}
                        onPress={() => {
                          setZoomedDate(DateTime.fromObject({ month: y.month, day: y.day }));
                        }}
                      >
                        <Text style={{ fontWeight }}>
                          {y.day}
                        </Text>
                        {y.events.length > 0 && (
                          <View>
                            {y.events.map(z => (
                              <View
                                key={`event-${z.id}`}
                                style={styles.eventItemWrapper}
                              >
                                <Text
                                  numberOfLines={2}
                                  style={styles.eventItemText}
                                >
                                  {z.title}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              );
            })}
        </View>
      </ScrollView>
      {!!zoomedDate && (
        <Pressable
          style={styles.zoomedCalendarCellWrapper}
          onPress={() => {
            setZoomedDate(undefined);
          }}
        >
          <View
            style={styles.zoomedCalendarCellContent}
            onStartShouldSetResponder={(e) => {
              e.stopPropagation();
              return false;
            }}
          >
            <Text>
              {zoomedDate.toFormat('yyyy-MM-dd')}
            </Text>
            <ScrollView>
              <View style={styles.zoomedHourWrapper}>
                {hours.map((x, i) => (
                  <View style={styles.zoomedHour} key={i}>
                    <Text>{i + 1}</Text>
                    {events
                      .filter(x =>
                        DateTime.fromISO(x.startDate).day === zoomedDate.day &&
                        DateTime.fromISO(x.startDate).hour === i + 1)
                      .map(x => (
                        <View
                          key={x.id}
                          style={styles.eventItemWrapper}
                        >
                          <Text>{x.title}</Text>
                        </View>
                      ))
                    }
                    <Pressable onPress={() => {
                      const suggestedStartDate = zoomedDate.set({ hour: i + 1}).toJSDate();
                      showModal<AddScreenProps>({
                        screen: 'ADD',
                        title: 'Add',
                        passProps: {
                          suggestedStartDate,
                          suggestAddType: 'EVENT',
                        },
                      });
                    }}>
                      <View style={styles.buttonAdd}>
                        <Text>
                          Add
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </Pressable>
      )}

    </SafeAreaView>
  );
};

export default CalendarScreen;

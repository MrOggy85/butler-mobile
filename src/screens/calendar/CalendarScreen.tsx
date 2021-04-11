import { DateTime } from 'luxon';
import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { events } from '../../../mockData/data';

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
});

const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

type DateCell = {
  month: number;
  day: number;
  key: string;
  events: typeof events;
}

function getEventsOfTheDay(date: DateTime) {
  const eventsOfTheDay = events.filter(x => {
    const eventDate = DateTime.fromMillis(x.startDate);
    return date.hasSame(eventDate, 'day');
  });
  return eventsOfTheDay;
}

const CalendarScreen: FunctionComponent<Props> = ({}: Props) => {
  const listItems: DateCell[][] = [];

  const now = DateTime.now();
  const firstDayOfCurrentMonth = DateTime.fromObject({ year: now.year, month: now.month, day: 1 });
  const lastDayOfPreviousMonth = firstDayOfCurrentMonth.minus({ day: 1 }).day;

  let currentDate = firstDayOfCurrentMonth.plus({ day: 0 });

  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    const row: DateCell[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      if (rowIndex === 0) {
        if (dayIndex >= firstDayOfCurrentMonth.weekday - 1) {
          const eventsOfTheDay = getEventsOfTheDay(currentDate);
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
          const eventsOfTheDay = getEventsOfTheDay(date);
          row.push({
            key: `${rowIndex}-${dd}`,
            month: firstDayOfCurrentMonth.minus({ month: 1}).month,
            day: dd,
            events: eventsOfTheDay,
          });
        }
      } else {
        const eventsOfTheDay = getEventsOfTheDay(currentDate);
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
                      <View
                        key={y.key}
                        style={[styles.calendarCell, { backgroundColor }]}
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
                      </View>
                    );
                  })}
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CalendarScreen;

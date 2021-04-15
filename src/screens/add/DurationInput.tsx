import React, { FunctionComponent, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HOURS = Array.from(Array(99));
const MINUTES = Array.from(Array(60));
const ITEM_HEIGHT = 40;

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    marginRight: 5,
  },
  scrollViewWrapper: {
    height: 40,
    width: 100,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  listItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  listItemText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

type Props = {
  hour: number;
  minute: number;
  onHourScrollEnd: (hour: number) => void;
  onMinuteScrollEnd: (minute: number) => void;
}

const DurationInput: FunctionComponent<Props> = ({
  hour,
  minute,
  onHourScrollEnd,
  onMinuteScrollEnd,
}) => {
  const durationHourRef = useRef<ScrollView>(null);
  const durationMinRef = useRef<ScrollView>(null);
  useEffect(() => {
    const h = hour > 99
      ? 99
      : hour < 0
        ? 0
        : hour;
    durationHourRef.current?.scrollTo({ x: 0, y: h * ITEM_HEIGHT });
  }, [hour]);

  useEffect(() => {
    const m = minute > 59
      ? 59
      : minute < 0
        ? 0
        : minute;
        durationMinRef.current?.scrollTo({ x: 0, y: m * ITEM_HEIGHT });
  }, [minute]);

  return (
    <View>
      <Text style={styles.label}>Duration</Text>
      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Hours</Text>
          <View style={styles.scrollViewWrapper}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={durationHourRef}
              snapToInterval={ITEM_HEIGHT}
              onMomentumScrollEnd={(e) => {
                const index = e.nativeEvent.contentOffset.y / ITEM_HEIGHT;
                onHourScrollEnd(index);
              }}
            >
              {HOURS.map((_, i) => {
                return (
                  <View
                    key={i}
                    style={styles.listItem}
                  >
                    <Text style={styles.listItemText}>{i}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Minutes</Text>
          <View style={styles.scrollViewWrapper}>
            <ScrollView
              ref={durationMinRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              onMomentumScrollEnd={(e) => {
                const index = e.nativeEvent.contentOffset.y / ITEM_HEIGHT;
                onMinuteScrollEnd(index);
              }}
            >
              {MINUTES.map((_, i) => {
                return (
                  <View
                    key={i}
                    style={styles.listItem}
                  >
                    <Text style={styles.listItemText}>{i}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DurationInput;

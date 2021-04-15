import React, { FunctionComponent, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Navigation, NavigationComponentProps, NavigationFunctionComponent, OptionsTopBarButton } from 'react-native-navigation';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, removeTask, updateTask } from '../../core/redux/taskReducer';
import { Task } from '../../core/redux/types';
import screens from '../../core/navigation/screens';
import { DateTime, Interval } from 'luxon';
import { addEvent, removeEvent, updateEvent } from '../../core/redux/eventReducer';
import DurationInput from './DurationInput';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  root: {
    flex: 1,
    padding: 20,
    backgroundColor: 'whitesmoke',
  },
  dateInputWrapper: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  datePicker: {
    height: 50,
    padding: 0,
    margin: 0,
    backgroundColor: '#FFF',
  },
  dateLabel: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 7,
  },
  datePickerResetText: {
    width: 50,
    textAlign: 'center',
  },
  visibleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibleLabel: {
    paddingLeft: 10,
    fontSize: 20,
  },
});

type DateInputProps = {
  label: string;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const DateInput: FunctionComponent<DateInputProps> = ({
  label,
  date,
  isChecked,
  setIsChecked,
  setDate,
}) => {
  return (
    <View>
      <Text style={styles.dateLabel}>
        {label}
      </Text>
      <View style={styles.dateInputWrapper}>
        <CheckBox
          value={isChecked}
          onValueChange={setIsChecked}
          boxType="square"
          animationDuration={0.1}
        />
        <DatePicker
          style={styles.datePicker}
          date={date}
          onDateChange={setDate}
          is24hourSource="locale"
          locale="en-SE"
        />
        <Pressable
          onPress={() => {
            setDate(new Date());
          }}
        >
          <Text
            numberOfLines={2}
            style={styles.datePickerResetText}
          >
            Reset to Now
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

type AddType = 'TASK' | 'EVENT'

type OwnProps = {
  id?: Task['id'];
  suggestedStartDate?: Date;
  suggestAddType?: AddType;
};
type Props = OwnProps & NavigationComponentProps;

function setTopBarTitle(title: string) {
  Navigation.mergeOptions(screens.ADD.id, {
    topBar: {
      title: {
        text: title,
      },
    },
  });
}

type Hej = {
  addType: AddType;
  setAddType: React.Dispatch<React.SetStateAction<AddType>>;
  hide?: boolean;
}

function setTopBarRightButton({ addType, setAddType, hide }: Hej) {
  const rightButtons: OptionsTopBarButton[] | undefined = !hide ? [
    {
      id: 'MODAL_TOPBAR_RIGHT_BUTTON',
      text: 'Switch',
    },
  ] : [];

  Navigation.mergeOptions(screens.ADD.id, {
    topBar: {
      rightButtons,
    },
  });

  return Navigation.events().registerNavigationButtonPressedListener((event) => {
    if (event.buttonId !== 'MODAL_TOPBAR_RIGHT_BUTTON') {
      return;
    }
    setAddType(addType === 'TASK' ? 'EVENT' : 'TASK');
  });
}

const AddScreen: NavigationFunctionComponent<Props> = ({ componentId, id, suggestedStartDate, suggestAddType }: Props) => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.task.tasks);
  const events = useSelector(state => state.event.events);

  const initStartDate = DateTime.fromJSDate(suggestedStartDate || new Date());

  const [addType, setAddType] = useState(suggestAddType || 'TASK');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasStartDate, setHasStartDate] = useState(false);
  const [startDate, setStartDate] = useState(initStartDate.toJSDate());
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState(initStartDate.plus({ hour: 1}).toJSDate());

  useEffect(() => {
    if (id) {
      const item = addType === 'TASK'
        ? tasks.find(x => x.id === id)
        : events.find(x => x.id === id);
      if (!item) {
        return;
      }
      setTitle(item.title);
      setDescription(item.description);
      setStartDate(DateTime.fromISO(item.startDate).toJSDate());
      setDueDate(DateTime.fromISO(item.endDate).toJSDate());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const addEdit = id ? 'Edit' : 'Add'
    setTopBarTitle(addType === 'TASK' ? `${addEdit} Task` : `${addEdit} Event`);
    const subscription = setTopBarRightButton({ addType, setAddType, hide: !!id });
    return () => {
      subscription.remove();
    };
  }, [id, addType]);

  const onAdd = () => {
    if (addType === 'TASK') {
      dispatch(addTask({
        title,
        description,
        startDate: DateTime.fromJSDate(startDate).toISO(),
        endDate: DateTime.fromJSDate(dueDate).toISO(),
        completed: false,
      }));
    } else {
      dispatch(addEvent({
        title,
        description,
        startDate: DateTime.fromJSDate(startDate).toISO(),
        endDate: DateTime.fromJSDate(dueDate).toISO(),
      }));
    }

    Navigation.dismissModal(componentId);
  };

  const onChange = () => {
    if (!id) {
      return;
    }
    if (addType === 'TASK') {
      const task = tasks.find(x => x.id === id);
      if (!task) {
        return;
      }

      dispatch(updateTask({
        id,
        title,
        description,
        startDate: DateTime.fromJSDate(startDate).toISO(),
        endDate: DateTime.fromJSDate(dueDate).toISO(),
        completed: task.completed,
      }));
    } else {
      const event = events.find(x => x.id === id);
      if (!event) {
        return;
      }

      dispatch(updateEvent({
        id,
        title,
        description,
        startDate: DateTime.fromJSDate(startDate).toISO(),
        endDate: DateTime.fromJSDate(dueDate).toISO(),
      }));
    }

    Navigation.dismissModal(componentId);
  };

  const onRemove = () => {
    if (!id) {
      return;
    }

    if (addType === 'TASK') {
      dispatch(removeTask(id));
    } else {
      dispatch(removeEvent(id));
    }

    Navigation.dismissModal(componentId);
  };

  const interval = Interval.fromDateTimes(startDate, dueDate);
  const minutes = interval.count('minutes') - 1;
  const hourDiff = Math.floor(minutes / 60);
  const minuteDiff = minutes % 60;

  useEffect(() => {
    if (startDate.getTime() > dueDate.getTime()) {
      setDueDate(startDate);
    }
  }, [startDate, dueDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>

        <Input
          label="Title"
          text={title}
          setText={setTitle}
        />
        <TextArea
          label="Description"
          text={description}
          setText={setDescription}
        />
        <DateInput
          label="Start Date"
          date={startDate}
          setDate={setStartDate}
          isChecked={hasStartDate}
          setIsChecked={setHasStartDate}
        />
        <DurationInput
          hour={hourDiff}
          minute={minuteDiff}
          onHourScrollEnd={(hour) => {
            const dueDateMinute = DateTime.fromJSDate(dueDate).minute;
            const newDueDate = DateTime.fromJSDate(startDate).plus({ hours: hour }).set({ minute: dueDateMinute });
            setDueDate(newDueDate.toJSDate());
          }}
          onMinuteScrollEnd={(minute) => {
            const dueDateHour = DateTime.fromJSDate(dueDate).hour;
            const newDueDate = DateTime.fromJSDate(startDate).plus({ minutes: minute }).set({ hour: dueDateHour });
            setDueDate(newDueDate.toJSDate());
          }}
        />
        <View style={styles.visibleWrapper}>
          <CheckBox
            boxType="square"
            animationDuration={0.1}
          />
          <Text style={styles.visibleLabel}>
            Visible before Start Date
          </Text>
        </View>
        <DateInput
          label={addType === 'TASK' ? 'Due Date' : 'End Date'}
          date={dueDate}
          setDate={setDueDate}
          isChecked={hasDueDate}
          setIsChecked={setHasDueDate}
        />
        <Button
          text={id ? 'Change' : 'Add'}
          onPress={id ? onChange : onAdd}
          disabled={!title}
        />
        {id && (
          <Button
            text="Remove"
            onPress={onRemove}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddScreen;

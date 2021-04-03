import React, { FunctionComponent, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Navigation, NavigationComponentProps, NavigationFunctionComponent } from 'react-native-navigation';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, removeTask, updateTask } from '../../core/redux/taskReducer';
import { Task } from '../../core/redux/types';

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
  },
  dateLabel: {
    fontWeight: 'bold',
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

const DateInput: FunctionComponent<DateInputProps> = ({ label, date, isChecked, setIsChecked, setDate }) => {
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
          locale="en-GB"
        />
        <Pressable
          onPress={() => {
            setDate(new Date());
          }}
        >
          <Text>
            Reset
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

type OwnProps = {
  id?: Task['id'];
  suggestedStartDate?: Date;
};
type Props = OwnProps & NavigationComponentProps;

const AddScreen: NavigationFunctionComponent<Props> = ({ componentId, id, suggestedStartDate }: Props) => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.task.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasStartDate, setHasStartDate] = useState(false);
  const [startDate, setStartDate] = useState(suggestedStartDate || new Date());
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());

  useEffect(() => {
    if (id) {
      const task = tasks.find(x => x.id === id);
      if (!task) {
        return;
      }
      setTitle(task.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAdd = () => {
    dispatch(addTask({
      title,
      description,
      startDate: startDate.getTime(),
      endDate: dueDate.getTime(),
    }));
    Navigation.dismissModal(componentId);
  };

  const onChange = () => {
    if (!id) {
      return;
    }

    dispatch(updateTask({
      id,
      title,
      description,
      startDate: startDate.getTime(),
      endDate: dueDate.getTime(),
    }));
    Navigation.dismissModal(componentId);
  };

  const onRemove = () => {
    if (!id) {
      return;
    }

    dispatch(removeTask({
      id,
      title,
      description,
      startDate: startDate.getTime(),
      endDate: dueDate.getTime(),
    }));
    Navigation.dismissModal(componentId);
  };

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
          label="Due Date"
          date={dueDate}
          setDate={setDueDate}
          isChecked={hasDueDate}
          setIsChecked={setHasDueDate}
        />
        <Button
          text={id ? 'Change' : 'Add'}
          onPress={id ? onChange : onAdd}
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
}

export default AddScreen;

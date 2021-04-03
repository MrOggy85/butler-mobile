import uuid from 'uuid';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import localStorage from '../localStorage';
import { Task } from './types';

const NAMESPACE = 'task';

export const loadTask = createAsyncThunk<
Task[],
void,
{}
>(
  `${NAMESPACE}/load`,
  async (task, thunkApi) => {
    const tasks = await localStorage.load<Task[]>('TASKS');
    if (!tasks) {
      throw Error('Problem loading Tasks from Localstorage');
    }
    return tasks;
  },
);

type TaskAdd = Omit<Task, 'id'>;

export const addTask = createAsyncThunk<
Task,
TaskAdd,
{}
>(
  `${NAMESPACE}/add`,
  async (task, thunkApi) => {
    const tasks = await localStorage.load<Task[]>('TASKS');
    if (!tasks) {
      throw Error('Problem loading Tasks from Localstorage');
    }
    const id = uuid.v4();
    const taskWithId = {
      ...task,
      id,
    };

    tasks.push(taskWithId);
    const result = await localStorage.save<Task[]>('TASKS', tasks);
    if (!result) {
      throw Error('Task not saved in Localstorage');
    }
    return taskWithId;
  },
);

export const updateTask = createAsyncThunk<
Task[],
Task,
{}
>(
  `${NAMESPACE}/update`,
  async (task, thunkApi) => {
    const tasks = await localStorage.load<Task[]>('TASKS');
    if (!tasks) {
      throw Error('Problem loading Tasks from Localstorage');
    }

    const newTasks = tasks.filter(x => x.id !== task.id);

    newTasks.push(task);
    const result = await localStorage.save<Task[]>('TASKS', newTasks);
    if (!result) {
      throw Error('Task not saved in Localstorage');
    }
    return newTasks;
  },
);

export const removeTask = createAsyncThunk<
Task[],
Task,
{}
>(
  `${NAMESPACE}/remove`,
  async (task, thunkApi) => {
    const tasks = await localStorage.load<Task[]>('TASKS');
    if (!tasks) {
      throw Error('Problem loading Tasks from Localstorage');
    }

    const newTasks = tasks.filter(x => x.id !== task.id);

    const result = await localStorage.save<Task[]>('TASKS', newTasks);
    if (!result) {
      throw Error('Task not saved in Localstorage');
    }
    return newTasks;
  },
);

const taskSlice = createSlice({
  name: NAMESPACE,
  initialState: {
    tasks: [] as Task[],
  },
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });

    builder.addCase(loadTask.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export default taskSlice;

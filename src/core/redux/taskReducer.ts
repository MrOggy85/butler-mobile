import uuid from 'uuid';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task } from './types';
import { readJsonFile, writeJsonFile } from '../files/files';

const NAMESPACE = 'task';

async function readWriteToFile(updateTasks: (tasks: Task[]) => Task[]) {
  const tasks = await readJsonFile<Task[]>('tasks.json');
  if (!tasks) {
    throw Error('Problem loading Tasks from Localstorage');
  }

  const updatedTasks = updateTasks(tasks);
  const result = await writeJsonFile<Task[]>('tasks.json', updatedTasks);
  if (!result) {
    throw Error('Task not saved in Localstorage');
  }
}

export const loadTask = createAsyncThunk<
Task[],
void,
{}
>(
  `${NAMESPACE}/load`,
  async (_, _thunkApi) => {
    const tasks = await readJsonFile<Task[]>('tasks.json');
    if (!tasks) {
      await writeJsonFile<Task[]>('tasks.json', []);
      return [];
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
  async (task, _thunkApi) => {
    const id = uuid.v4();
    const taskWithId = {
      ...task,
      id,
    };

    await readWriteToFile((tasks) => {
      tasks.push(taskWithId);
      return tasks;
    });
    return taskWithId;
  },
);

export const updateTask = createAsyncThunk<
Task[],
Task,
{}
>(
  `${NAMESPACE}/update`,
  async (task, _thunkApi) => {
    let newTasks: Task[] = [];

    await readWriteToFile((tasks) => {
      newTasks = tasks.filter(x => x.id !== task.id);
      newTasks.push(task);
      return tasks;
    });
    return newTasks;
  },
);

export const removeTask = createAsyncThunk<
Task[],
Task,
{}
>(
  `${NAMESPACE}/remove`,
  async (task, _thunkApi) => {
    let newTasks: Task[] = [];

    await readWriteToFile((tasks) => {
      newTasks = tasks.filter(x => x.id !== task.id);
      return newTasks;
    });
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

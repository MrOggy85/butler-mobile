import uuid from 'uuid';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Event } from './types';
import { readJsonFile, writeJsonFile } from '../files/files';

const NAMESPACE = 'event';
const FILENAME = 'events.json';

async function readWriteToFile(updateEvents: (events: Event[]) => Event[]) {
  const events = await readJsonFile<Event[]>(FILENAME);
  if (!events) {
    throw Error('Problem loading Events from FileSystem');
  }

  const updatedEvents = updateEvents(events);
  const result = await writeJsonFile<Event[]>(FILENAME, updatedEvents);
  if (!result) {
    throw Error('Event not saved in FileSystem');
  }
}

export const loadEvents = createAsyncThunk<
Event[],
void,
{}
>(
  `${NAMESPACE}/load`,
  async (_, _thunkApi) => {
    const events = await readJsonFile<Event[]>(FILENAME);
    if (!events) {
      await writeJsonFile<Event[]>(FILENAME, []);
      return [];
    }
    return events;
  },
);

type EventAdd = Omit<Event, 'id'>;

export const addEvent = createAsyncThunk<
Event,
EventAdd,
{}
>(
  `${NAMESPACE}/add`,
  async (event, _thunkApi) => {
    const id = uuid.v4();
    const eventWithId = {
      ...event,
      id,
    };

    await readWriteToFile((events) => {
      events.push(eventWithId);
      return events;
    });
    return eventWithId;
  },
);

export const updateEvent = createAsyncThunk<
Event[],
Event,
{}
>(
  `${NAMESPACE}/update`,
  async (event, _thunkApi) => {
    let newEvents: Event[] = [];

    await readWriteToFile((events) => {
      newEvents = events.filter(x => x.id !== event.id);
      newEvents.push(event);
      return newEvents;
    });
    return newEvents;
  },
);

export const removeEvent = createAsyncThunk<
Event[],
Event['id'],
{}
>(
  `${NAMESPACE}/remove`,
  async (eventId, _thunkApi) => {
    let newEvents: Event[] = [];

    await readWriteToFile((events) => {
      newEvents = events.filter(x => x.id !== eventId);
      return newEvents;
    });
    return newEvents;
  },
);

const eventSlice = createSlice({
  name: NAMESPACE,
  initialState: {
    events: [] as Event[],
  },
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addEvent.fulfilled, (state, action) => {
      state.events.push(action.payload);
    });
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      state.events = action.payload;
    });
    builder.addCase(removeEvent.fulfilled, (state, action) => {
      state.events = action.payload;
    });

    builder.addCase(loadEvents.fulfilled, (state, action) => {
      state.events = action.payload;
    });
  },
});

export default eventSlice;

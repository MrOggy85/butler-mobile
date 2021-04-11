import taskSlice from './taskReducer';
import eventSlice from './eventReducer';

const rootReducer = {
  task: taskSlice.reducer,
  event: eventSlice.reducer,
};

export default rootReducer;

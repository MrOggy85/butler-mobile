import taskSlice from './taskReducer';

const rootReducer = {
  task: taskSlice.reducer,
};

export default rootReducer;

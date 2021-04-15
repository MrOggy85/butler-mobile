import { useDispatch as reduxUseDispatch } from 'react-redux';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { AnyObject } from '../typescript/typeHelpers';
import type { RootState } from './store';

function useDispatch() {
  const dispatch = reduxUseDispatch<ThunkDispatch<RootState, AnyObject, Action<string>>>();
  return dispatch;
}

export default useDispatch;

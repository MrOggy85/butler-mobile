import AsyncStorage from '@react-native-async-storage/async-storage';

type Key = 'TASKS' | 'EVENTS'

function getKey(mainKey: Key, subKey?: string) {
  return !subKey ? mainKey : `${mainKey}_${subKey}`;
}

async function save<T>(mainKey: Key, value: T, subKey?: string): Promise<boolean> {
  try {
    const stringifiedValue = JSON.stringify(value);
    const key = getKey(mainKey, subKey);
    await AsyncStorage.setItem(key, stringifiedValue);
    return true;
  } catch (error) {
    return false;
  }
}

async function load<T>(mainKey: Key, subKey?: string): Promise<T | null> {
  try {
    const key = getKey(mainKey, subKey);
    const stringifiedValue = await AsyncStorage.getItem(key);
    if (!stringifiedValue) {
      return null;
    }
    const value = JSON.parse(stringifiedValue) as T;
    return value;
  } catch (error) {
    return null;
  }
}

const localStorage = {
  save,
  load,
};

async function init() {
  const tasks = await load('TASKS');
  if (!tasks) {
    await save('TASKS', []);
  }
  const events = await load('EVENTS');
  if (!events) {
    await save('EVENTS', []);
  }
}
init();

export default localStorage;

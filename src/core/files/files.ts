import RNFS from 'react-native-fs';

type Filename = 'tasks.json'

export async function readJsonFile<T>(filename: Filename): Promise<T | null> {
  const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
  try {
    const contents = await RNFS.readFile(path);
    const object = JSON.parse(contents) as T;
    return object;
  } catch (error) {
    return null;
  }
}

export async function writeJsonFile<T>(filename: Filename, object: T): Promise<boolean> {
  const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
  try {
    const stringifiedValue = JSON.stringify(object);
    await RNFS.writeFile(path, stringifiedValue);
    return true;
  } catch (error) {
    return false;
  }
}

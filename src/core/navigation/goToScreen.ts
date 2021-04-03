import { Navigation } from 'react-native-navigation';
import screens from './screens';

type Screen = keyof typeof screens

type Params<P> = {
  screenName: Screen;
  titleText: string;
  componentId: string;
  passProps?: P;
}

function goToScreen<P>({ screenName, titleText, componentId, passProps }: Params<P>) {
  const { name } = screens[screenName];

  Navigation.push(componentId, {
    component: {
      name,
      options: {
        topBar: {
          title: {
            text: titleText,
          },
        },
      },
      passProps,
    },
  });
}

export default goToScreen;

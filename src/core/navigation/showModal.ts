import { Navigation, OptionsModalPresentationStyle, OptionsTopBarTitle } from 'react-native-navigation';
import screens from './screens';

type SCREENS = keyof typeof screens;

type Props<T> = {
  screen: SCREENS;
  title: OptionsTopBarTitle['text'];
  passProps?: T;
}

const BACK_BUTTON_ID = 'MODAL_BACK_BUTTON_ID';

Navigation.events().registerNavigationButtonPressedListener((event) => {
  if (event.buttonId !== BACK_BUTTON_ID) {
    return;
  }
  Navigation.dismissModal(event.componentId);
});

export function showModal<T>({ screen, title, passProps }: Props<T>): void {
  const { id, name } = screens[screen];

  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            id,
            name,
            passProps,
            options: {
              modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
              topBar: {
                leftButtons: [
                  {
                    id: BACK_BUTTON_ID,
                    text: 'Back',
                  },
                ],
                rightButtons: [
                  {
                    id: 'MODAL_TOPBAR_RIGHT_BUTTON',
                    text: 'Switch',
                  },
                ],
                title: {
                  text: title,
                },
              },
            },
          },
        },
      ],
    },
  })
}

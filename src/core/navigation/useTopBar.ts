import { useEffect } from 'react';
import { EventsRegistry, Navigation, OptionsTopBarButton } from 'react-native-navigation';
import screens from './screens';

type NavigationButtonPressedListener = Parameters<EventsRegistry['registerNavigationButtonPressedListener']>[0]

type Screen = keyof typeof screens

type SetRightButton = {
  key: Screen;
  options: OptionsTopBarButton;
}

function setRightButton({ key, options }: SetRightButton) {
  const screen = screens[key];
  Navigation.mergeOptions(screen.id, {
    topBar: {
      rightButtons: [
        {
          ...options,
        },
      ],
    },
  });
}

function useTopBar(callback: NavigationButtonPressedListener) {
  useEffect(() => {
    const subscription = Navigation.events().registerNavigationButtonPressedListener(callback);
    return () => {
      subscription.remove();
    };
  }, [callback]);

  return {
    setRightButton,
  };
}

export default useTopBar;

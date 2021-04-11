import { Navigation } from 'react-native-navigation';
import screens from './screens';
import WithRedux from './WithRedux';
import HomeScreen from '../../screens/home/HomeScreen';
import AddScreen from '../../screens/add/AddModal';
import MainScreen from '../../screens/main/MainScreen';
import CalendarScreen from '../../screens/calendar/CalendarScreen';

const { MAIN, HOME, ADD, CALENDAR } = screens;

Navigation.registerComponent(MAIN.name, () => WithRedux(MainScreen));
Navigation.registerComponent(HOME.name, () => WithRedux(HomeScreen));
Navigation.registerComponent(ADD.name, () => WithRedux(AddScreen));
Navigation.registerComponent(CALENDAR.name, () => WithRedux(CalendarScreen));

Navigation.events().registerAppLaunchedListener(() => {
   Navigation.setRoot({
     root: {
       stack: {
         children: [
           {
             component: {
               id: MAIN.id,
               name: MAIN.name,
               options: {
                 topBar: {
                   title: {
                     text: 'Agenda',
                   },
                 },
               },
             },
           },
         ],
       },
     },
  });
});

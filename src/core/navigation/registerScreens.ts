import { Navigation } from 'react-native-navigation';
import screens from './screens';
import WithRedux from './WithRedux';
import HomeScreen from '../../screens/home/HomeScreen';
import AddScreen from '../../screens/add/AddModal';

const { HOME, ADD } = screens;

Navigation.registerComponent(HOME.name, () => WithRedux(HomeScreen));
Navigation.registerComponent(ADD.name, () => WithRedux(AddScreen));

Navigation.events().registerAppLaunchedListener(() => {
   Navigation.setRoot({
     root: {
       stack: {
         children: [
           {
             component: {
               name: HOME.name,
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

import {Routes} from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {FavoritesPageComponent} from './pages/favorites-page/favorites-page.component';
import {HistoryPageComponent} from './pages/history-page/history-page.component';
import {DiaryCalendarPageComponent} from './pages/diary-calendar-page/diary-calendar-page.component';
import {GraphicMoodsPageComponent} from './pages/graphic-moods-page/graphic-moods-page.component';
import {FeelsPageComponent} from './pages/feels-page/feels-page.component';

export const routes: Routes = [
  //rutas music
  {
    path: '',
    title: 'Moodify | Home',
    component: HomePageComponent
  },
  {
    path: 'favorites',
    title: 'Moodify | Favoritos',
    component: FavoritesPageComponent
  },
  {
    path: 'history',
    title: 'Moodify | Historial',
    component: HistoryPageComponent
  },
  {
    path: 'diary',
    title: 'Moodify | Diario',
    component: DiaryCalendarPageComponent
  },
  {
    path: 'graphics',
    title: 'Moodify | Gráficos',
    component: GraphicMoodsPageComponent
  },
  {
    path: 'moods',
    title: 'Moodify | Moods',
    component: FeelsPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

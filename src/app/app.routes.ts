import {Routes} from '@angular/router';
import {AuthPageComponent} from './pages/Auth/auth-page/auth-page.component';
import {HomePageComponent} from './pages/Aplication/home-page/home-page.component';
import {FavoritesPageComponent} from './pages/Aplication/favorites-page/favorites-page.component';
import {HistoryPageComponent} from './pages/Aplication/history-page/history-page.component';
import {DiaryCalendarPageComponent} from './pages/Aplication/diary-calendar-page/diary-calendar-page.component';
import {GraphicMoodsPageComponent} from './pages/Aplication/graphic-moods-page/graphic-moods-page.component';
import {FeelsPageComponent} from './pages/Aplication/feels-page/feels-page.component';
import {MainPageComponent} from './pages/Aplication/main-page/main-page.component';
import {AboutPageComponent} from './pages/Aplication/about-page/about-page.component';
import {LogoutPageComponent} from './pages/Aplication/logout-page/logout-page.component';
import {LoginComponent} from './pages/Auth/login/login.component';
import {RegisterComponent} from './pages/Auth/register/register.component';


export const routes: Routes = [
  {
    path: 'auth',
    title: 'Moodify | Autentificación',
    component: AuthPageComponent,
    children: [
      { component: LoginComponent, path: 'login' },
      { component: RegisterComponent, path: 'register' },
      { path: "**", redirectTo: 'login' }
    ]
  },
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'home',
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
        path: 'about',
        title: 'Moodify | About Moodify',
        component: AboutPageComponent
      },
      // {
      //   path: 'social',
      //   title: 'Moodify | Social Media',
      //   component: FeelsPageComponent
      // },
      {
        path: 'logout',
        title: 'Moodify | Bye',
        component: LogoutPageComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

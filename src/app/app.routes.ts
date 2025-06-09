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
import {LoginComponent} from './pages/Auth/login/login.component';
import {RegisterComponent} from './pages/Auth/register/register.component';
import {ApiFunComponent} from './apis/api-fun/api-fun.component';
import {ApiCatComponent} from './apis/api-cat/api-cat.component';
import {GiphyApiComponent} from './apis/giphy-api/giphy-api.component';
import {BuscaminasComponent} from './apis/buscaminas/buscaminas.component';
import {MemoryComponent} from './apis/memory/memory.component';
import {AuthGuard} from './guards/auth.guard';
import {SettingsPageComponent} from './pages/Aplication/settings-page/settings-page.component';
import {ForgotPasswordComponent} from './pages/Auth/forgot-password/forgot-password.component';
export const routes: Routes = [
  {
    path: 'auth',
    title: 'Moodify | Autentificación',
    component: AuthPageComponent,
    children: [
      {component: LoginComponent, path: 'login', title: 'Moodify | Login'},
      {component: RegisterComponent, path: 'register', title: 'Moodify | Registro'},
      {component: ForgotPasswordComponent, path: 'forgot-password', title: 'Moodify | Recuperar contraseña'},
      {path: "**", redirectTo: 'login'}
    ]
  },
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'home',
        title: 'Moodify | Home',
        component: HomePageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'favorites',
        title: 'Moodify | Favoritos',
        component: FavoritesPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'history',
        title: 'Moodify | Historial',
        component: HistoryPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'diary',
        title: 'Moodify | Diario',
        component: DiaryCalendarPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'graphics',
        title: 'Moodify | Gráficos',
        component: GraphicMoodsPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'moods',
        title: 'Moodify | Moods',
        component: FeelsPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'about',
        title: 'Moodify | About Moodify',
        component: AboutPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        title: 'Moodify | Ajustes 🔩',
        component:SettingsPageComponent,
      },
      {
        path: 'apifun'
        , title: 'Moodify | API Fun',
        component: ApiFunComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'api-cat',
        title: 'Moodify | Random Cat 😸',
        component: ApiCatComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'api-games',
        title: 'Moodify | Buscaminas 🎳',
        component: BuscaminasComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'giphy-api',
        title: 'Moodify | Giphy API',
        component: GiphyApiComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'cards-api',
        title: 'Moodify | Parejas 🧠',
        component: MemoryComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

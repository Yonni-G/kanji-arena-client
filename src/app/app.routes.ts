import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { ClassicComponent } from './pages/games/classic/classic.component';
import { GameLayoutComponent } from './pages/games/game-layout/game-layout.component';
import { ReverseComponent } from './pages/games/reverse/reverse.component';
import { IdeasComponent } from './pages/ideas/ideas.component';
import { GameMode } from './models/GameMode';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'ROUTES.ABOUT' },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: { title: 'ROUTES.CONTACT' },
  },
  {
    path: '',
    component: HomeComponent,
    data: { title: 'ROUTES.HOME' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'ROUTES.LOGIN' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'ROUTES.REGISTER' },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'ROUTES.FORGOT_PASSWORD' },
  },
  {
    path: 'reset-password/:resettoken',
    component: ResetPasswordComponent,
    data: { title: 'ROUTES.RESET_PASSWORD' },
  },
  {
    path: 'dashboard/profile',
    component: ProfileComponent,
    data: { title: 'ROUTES.PROFILE' },
    canActivate: [authGuard],
  },
  {
    path: 'games',
    component: GameLayoutComponent,
    children: [
      {
        path: 'classic',
        component: ClassicComponent,
        data: {
          title: 'ROUTES.CLASSIC',
          gameName: 'ROUTES.CLASSIC_NAME',
          gameMode: GameMode.CLASSIC,
          gameDesc: 'ROUTES.CLASSIC_DESC',
        },
      },
      {
        path: 'reverse',
        component: ReverseComponent,
        data: {
          title: 'ROUTES.REVERSE',
          gameName: 'ROUTES.REVERSE_NAME',
          gameMode: GameMode.REVERSE,
          gameDesc: 'ROUTES.REVERSE_DESC',
        },
      },
      { path: '', redirectTo: 'classic', pathMatch: 'full' },
    ],
  },
  {
    path: 'ideas',
    component: IdeasComponent,
    data: { title: 'ROUTES.IDEAS' },
  },
];

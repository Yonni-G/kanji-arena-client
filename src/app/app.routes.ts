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
    data: { title: 'À propos de Kanji-Arena' },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: { title: 'Contactez-nous' },
  },
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Quizz de Kanji Japonais - Jeux en ligne' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Connexion à votre compte' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Créer votre compte' },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Oubli de mot de passe' },
  },
  {
    path: 'reset-password/:resettoken',
    component: ResetPasswordComponent,
    data: { title: 'Recréez votre mot de passe' },
  },
  {
    path: 'dashboard/profile',
    component: ProfileComponent,
    data: { title: 'Votre profil' },
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
          title: 'Jeu Classic mode',
          gameName: 'Classic',
          gameMode: GameMode.CLASSIC,
          gameDesc:
            'Devinez le sens associé à 10 Kanji le plus rapidement possible',
        },
      },
      {
        path: 'reverse',
        component: ReverseComponent,
        data: {
          title: 'Jeu Reverse mode',
          gameName: 'Reverse',
          gameMode: GameMode.REVERSE,
          gameDesc:
            'Devinez 10 Kanji associés au sens proposé le + rapidement possible !',
        },
      },
      { path: '', redirectTo: 'classic', pathMatch: 'full' }, // fallback
    ],
  },
  { path: 'ideas', component: IdeasComponent, data: { title: 'Idées de prochains jeux' } },
];

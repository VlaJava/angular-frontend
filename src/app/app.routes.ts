import { Routes } from '@angular/router';


import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

import { AdminPackagesComponent } from './pages/admin/admin-packages/admin-packages.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminReviewsComponent } from './pages/admin/admin-reviews/admin-reviews.component';
import { AdminReportsComponent } from './pages/admin/admin-reports/admin-reports.component';
import { DefaultHomeComponent } from './pages/home/default-home/defaultHome.component';
import { UserProfileComponent } from './pages/profile/user-profile/user-profile.component';

export const routes: Routes = [
 
  {
    path: "",
    component: DefaultHomeComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  {
    path: 'perfil', 
    component: UserProfileComponent

  },

  {
    path: 'admin',
    component: AdminLayoutComponent, 
    // Rota do Painel Administrativo
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
       
      { path: 'dashboard', component: AdminUsersComponent },
      { path: 'pacotes', component: AdminPackagesComponent },
      { path: 'usuarios', component: AdminUsersComponent },
      { path: 'avaliacoes', component: AdminReviewsComponent },
      { path: 'relatorios', component: AdminReportsComponent },
    ]
  }
];
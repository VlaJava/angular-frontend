import { Routes } from '@angular/router';



import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DefaultHomeComponent } from './pages/home/default-home/defaultHome.component';


import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

import { PackageDetailsComponent } from './pages/package-details/package-details.component';
import { BookingFinalizationComponent } from './pages/booking-finalization/booking-finalization.component';

import { AdminPackagesComponent } from './pages/admin/admin-packages/admin-packages.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminReviewsComponent } from './pages/admin/admin-reviews/admin-reviews.component';
import { AdminReportsComponent } from './pages/admin/admin-reports/admin-reports.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AccountConfirmedComponent } from './pages/account-confirmed/account-confirmed.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { PackageAdminComponent } from './pages/packages-admin/packages-admin.component';




export const routes: Routes = [
  // --- Rotas Públicas ---
  {
    path: "",
    component: DefaultHomeComponent,
    pathMatch: 'full'
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

    path: 'reset-password',
    component: ResetPasswordComponent

  },

  {
    path: 'auth/signup/account-confirmation',
    redirectTo: 'account-confirmation',
    pathMatch: 'full'
  },

  {

    path: 'account-confirmation',
    component: AccountConfirmedComponent

  },
  {
    path: 'packages/:id',
    component: PackageDetailsComponent
  },



  // --- Rota Privada para Usuários Logados ---
  {
    path: 'profile',
    component: ProfileComponent,

  },
  {
    path: 'finalize-booking',
    component: BookingFinalizationComponent,
    canActivate: [authGuard]
  },

  // --- Rota Privada para Administradores ---
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'packages', component: AdminPackagesComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'avaliacoes', component: AdminReviewsComponent },
      { path: 'relatorios', component: AdminReportsComponent },
    ]
  },
  { path: 'packages/:id/admin', 
    component: PackageAdminComponent 
  }
];
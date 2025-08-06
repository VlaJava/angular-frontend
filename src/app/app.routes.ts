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
import { PackageAdminComponent } from './pages/packages-admin/packages-admin.component';
import { UserReservationsComponent } from './pages/user-reservations/user-reservations.component';
import { PackagesListComponent } from './pages/packages-list/packages-list.component';


import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  // --- Rotas Públicas ---
  {
    path: "",
    component: DefaultHomeComponent,
    pathMatch: 'full',
    title: 'ViaJava'
  },
  {
    path: "login",
    component: LoginComponent,
    title: 'LOGIN'
  },
  {
    path: "signup",
    component: SignupComponent,
    title: 'CADASTRO'
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    title: 'ESQUECI A SENHA'
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'REDEFINIR SENHA'
  },
  {
    path: 'account-confirmation',
    component: AccountConfirmedComponent,
    title: 'CONTA CONFIRMADA'
  },
  {
    path: 'packages',
    component: PackagesListComponent,
    title: 'PACOTES'
  },
  {
    path: 'packages/:id',
    component: PackageDetailsComponent,
    title: 'DETALHES DO PACOTE'
  },

  // --- Rotas Privadas (Usuários Logados) ---
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'PERFIL'
  },
  {
    path: 'finalize-booking',
    component: BookingFinalizationComponent,
    canActivate: [authGuard],
    title: 'FINALIZAR RESERVA'
  },
  {
    path: 'reservations',
    component: UserReservationsComponent,
    canActivate: [authGuard], 
    title: 'MINHAS VIAGENS'
  },

  // --- Rotas Privadas (Administradores) ---
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent, title: 'ADMIN | Dashboard' },
      { path: 'packages', component: AdminPackagesComponent, title: 'ADMIN | Pacotes' },
      { path: 'packages/edit/:id', component: PackageAdminComponent, title: 'ADMIN | Editar Pacote' },
      { path: 'users', component: AdminUsersComponent, title: 'ADMIN | Usuários' },
      { path: 'reviews', component: AdminReviewsComponent, title: 'ADMIN | Avaliações' },
      { path: 'reports', component: AdminReportsComponent, title: 'ADMIN | Relatórios' },
    ]
  },
];
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { TravelPackagesComponent } from './pages/home/travel-packages/travel-packages.component';



export const routes: Routes = [
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
    path: "travel-packages",
    component: TravelPackagesComponent
}


];

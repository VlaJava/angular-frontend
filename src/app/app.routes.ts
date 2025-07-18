import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DefaultHomeComponent } from './pages/home/default-home/defaultHome.component';



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

    }



];

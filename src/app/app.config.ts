
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';


import { 
  provideHttpClient, 
  withFetch, 
  withInterceptorsFromDi 
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
 
    provideHttpClient(
      withFetch(), 
      withInterceptorsFromDi()
    ),
    
    provideToastr(),
    provideAnimations(),

   
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    }
    
    
  ]
};
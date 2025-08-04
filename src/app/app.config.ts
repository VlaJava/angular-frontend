import { ApplicationConfig, APP_INITIALIZER } from '@angular/core'; // Alteração 1: Importar APP_INITIALIZER
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
import { AuthService } from './services/auth.service';

export function initializeApp(authService: AuthService) {
  return (): Promise<any> => {
    return authService.initUser();
  };
}

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
    },
  
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService], 
      multi: true
    }
  ]
};

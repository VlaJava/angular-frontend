import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';


export const adminGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin$.pipe(
    take(1),
    map(isAdmin => {
      if (isAdmin) {
        return true; 
      } else {
        
        return router.parseUrl('/'); 
      }
    })
  );
};

import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../../Services/AuthServices/auth-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthServiceService);
  const router = inject(Router);
  
  if(!auth.isSignedIn()){
     sessionStorage.clear();
    return router.navigate(['/signin']).then(() => false);  
  }

  return true;
};

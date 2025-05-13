import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../../Services/AuthServices/auth-service.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthServiceService);
  const router = inject(Router);
  
  if(auth.isSignedIn()){
    return router.navigate(['/dashboard']).then(() => false);  
  }

  return true;
};

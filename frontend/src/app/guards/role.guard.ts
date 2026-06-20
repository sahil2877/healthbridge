import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Restricts a route to the given roles. Patients are sent to their portal,
// anyone else who lacks the role is sent to login.
export function roleGuard(...roles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.hasRole(...roles)) return true;

    router.navigate([auth.hasRole('patient') ? '/portal/home' : '/login']);
    return false;
  };
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user) {
          // Si no hay usuario autenticado, redirigir al inicio de sesión
          this.router.navigate(['/inicio']);
          return false;
        }
        return true; // Permitir acceso si el usuario está autenticado
      })
    );
  }
}

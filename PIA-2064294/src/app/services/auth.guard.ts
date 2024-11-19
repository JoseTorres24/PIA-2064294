// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();

    if (user) {
      return true; // Si hay un usuario autenticado, permitir el acceso
    } else {
      this.router.navigate(['/inicio']); // Redirigir al inicio de sesión
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (user) {
          // Si el usuario está autenticado, redirigir a los tabs
          this.router.navigate(['/tabs']);
          return false;
        }
        return true; // Permitir acceso a las rutas públicas si no hay usuario
      })
    );
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports:[IonicModule],
})
export class InicioComponent {
  constructor(private router: Router) {}

  // Navega a la pantalla de Iniciar Sesión
  irAIniciarSesion() {
    this.router.navigate(['/iniciar-sesion']);
  }

  // Navega a la pantalla de Crear Cuenta
  irACrearCuenta() {
    this.router.navigate(['/crear-cuenta']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader,IonToolbar,IonTitle,IonContent,IonButton } from '@ionic/angular/standalone';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports:[IonHeader,IonToolbar,IonTitle,IonContent,IonButton],
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

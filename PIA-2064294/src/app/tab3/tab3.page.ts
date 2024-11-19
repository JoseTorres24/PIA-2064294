import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta si es necesario
import { User } from '../Interfaces/user'; // Asegúrate de tener este tipo definido
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports:[IonicModule,NgIf]
})
export class Tab3Page implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Obtiene el usuario actual desde el servicio
    this.currentUser = this.authService.getCurrentUser();
  }

  async logout() {
    try {
      await this.authService.logout(); // Llama al método de cierre de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}

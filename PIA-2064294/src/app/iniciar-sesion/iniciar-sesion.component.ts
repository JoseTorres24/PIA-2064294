import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class IniciarSesionComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Lógica para comprobar las credenciales (simulada)
      console.log('Intentando iniciar sesión con:', { username, password });

      // Redirige al componente de Tabs
      this.router.navigate(['/tabs']);
    } else {
      console.error('Formulario inválido');
    }
  }
}

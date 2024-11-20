import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonHeader,IonToolbar,IonTitle,IonButtons,IonButton,IonIcon,IonContent,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonItem,IonLabel,IonInput} from '@ionic/angular/standalone';
@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.scss'],
  standalone: true,
  imports: [ ReactiveFormsModule,IonTitle ,IonHeader,IonToolbar,IonButtons,IonButton,IonIcon,IonContent,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonItem,IonLabel,IonInput],
})
export class IniciarSesionComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController
    
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo de email con validación
      password: ['', Validators.required], // Campo de contraseña requerido
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService
        .login(email, password)
        .then((user) => {
          console.log('Inicio de sesión exitoso:', user);
          this.router.navigate(['/tabs']); // Redirige al componente principal
        })
        .catch((error) => {
          console.error('Error al iniciar sesión:', error);
        });
    } else {
      console.error('Formulario inválido');
    }
  }
  goBack() {
    this.navCtrl.back(); // Regresa a la pantalla anterior en la pila de navegación
  }
}


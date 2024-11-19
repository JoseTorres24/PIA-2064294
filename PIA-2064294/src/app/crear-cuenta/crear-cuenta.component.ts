import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../Interfaces/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { FotoServiceService } from '../foto-service.service';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss'],
  standalone: true,
 imports:[NgIf,IonicModule, ReactiveFormsModule]
})
export class CrearCuentaComponent implements OnInit {
  registerForm!: FormGroup;
  selectedProfileImage: string | ArrayBuffer | null = null; // Imagen de perfil seleccionada

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private fotoService: FotoServiceService 
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.required, Validators.min(1)]],
      profileImage: [null], // Campo opcional para la imagen de perfil
    });
  }

  async takePhoto() {
    try {
      // Llamamos a addNewToGallery pasando el argumento 'false' para isProfileImage,
      // ya que no es una imagen de perfil, y el objeto note que es opcional.
      await this.fotoService.addNewToGallery(true); // Asume que no es una imagen de perfil.
  
      // Asigna la foto capturada al formulario
      this.selectedProfileImage = this.fotoService.photos[0].webviewPath || null;  // Si es undefined, asigna null.
 // Accede a la primera foto
      this.registerForm.patchValue({ profileImage: this.selectedProfileImage });  // Actualiza el formulario con la imagen
    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }
  // Manejo de selección de archivos para imagen de perfil
  onFileSelected(event: Event) {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.files &&
      event.target.files.length > 0
    ) {
      const file = event.target.files[0];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos válidos
      const maxFileSize = 5 * 1024 * 1024; // Tamaño máximo de archivo (5 MB)

      if (!validImageTypes.includes(file.type)) {
        console.error('Solo se permiten imágenes en formatos JPEG, PNG o GIF.');
        return;
      }

      if (file.size > maxFileSize) {
        console.error('El tamaño máximo permitido es de 5 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProfileImage = reader.result; // Guardar la imagen para vista previa
        this.registerForm.patchValue({ profileImage: reader.result }); // Actualizar el formulario
      };
      reader.readAsDataURL(file); // Leer la imagen como Base64
    }
  }

  // Quitar la imagen seleccionada
  removeSelectedImage() {
    this.selectedProfileImage = null;
    this.registerForm.patchValue({ profileImage: null }); // Resetear el valor del campo en el formulario
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.registerForm.valid) {
      const userData: User = this.registerForm.value as User;

      this.authService
        .register(userData)
        .then(() => {
          console.log('Registro exitoso');
          this.router.navigate(['/iniciar-sesion']); // Redirige a iniciar sesión
        })
        .catch((error) => {
          console.error('Error en el registro:', error);
        });
    }
  }
  goBack() {
    this.navCtrl.back(); // Regresa a la pantalla anterior en la pila de navegación
  }
  
}

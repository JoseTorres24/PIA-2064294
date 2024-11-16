import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../Interfaces/user'; // Asegúrate de que esta interfaz exista
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule,NgIf],
})
export class CrearCuentaComponent implements OnInit {
  registerForm!: FormGroup;
  selectedProfileImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.required, Validators.min(1)]],
      profileImage: [null], // Campo para la imagen de perfil
    });
  }

  onFileSelected(event: Event) {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.files &&
      event.target.files.length > 0
    ) {
      const file = event.target.files[0];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos de imágenes válidos
      const maxFileSize = 5 * 1024 * 1024; // 5 MB

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
        this.selectedProfileImage = reader.result;
        this.registerForm.patchValue({ profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedImage() {
    this.selectedProfileImage = null;
    this.registerForm.patchValue({ profileImage: null });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData: User = this.registerForm.value as User; // Tipado con la interfaz
      console.log('Datos del usuario:', userData);

      // Aquí podrías enviar los datos a un servicio o realizar más acciones
      // Por ejemplo: this.userService.register(userData).subscribe(...);

      // Limpiar el formulario y la imagen seleccionada
      this.registerForm.reset();
      this.selectedProfileImage = null;
    }
  }
}

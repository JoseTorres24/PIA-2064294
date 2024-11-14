import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../Interfaces/user'; // Importar la interfaz
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss'],
  standalone: true,
  imports:[IonicModule]
})
export class CrearCuentaComponent implements OnInit {
  registerForm!: FormGroup;
  selectedProfileImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.required, Validators.min(1)]],
      profileImage: [null]
    });
  }

  onFileSelected(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedProfileImage = reader.result;
        this.registerForm.patchValue({ profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData: User = this.registerForm.value as User; // Tipado con la interfaz
      console.log('Datos del usuario:', userData);

      // Aquí podrías enviar los datos a un servicio o realizar más acciones

      // Limpiar el formulario y la imagen seleccionada
      this.registerForm.reset();
      this.selectedProfileImage = null;
    }
  }
}
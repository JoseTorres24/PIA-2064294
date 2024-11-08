import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular/standalone';  // Importa los módulos necesarios de Ionic
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, CommonModule, ReactiveFormsModule, IonTextarea, IonTitle, IonToolbar]
})
export class Tab2Page {
  noteForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null; // Guardamos la imagen seleccionada

  constructor(private fb: FormBuilder) {
    // Inicializa el formulario con campos reactivos
    this.noteForm = this.fb.group({
      title: ['', Validators.required], // Título obligatorio
      description: ['', Validators.required], // Descripción obligatoria
      image: [null] // Campo de imagen
    });
  }

  // Maneja la selección de la imagen
  onFileSelected(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result; // Guarda la imagen seleccionada
        this.noteForm.patchValue({ image: reader.result }); // Actualiza el formulario con la imagen cargada
      };
      reader.readAsDataURL(file); // Lee la imagen como Data URL
    }
  }

  // Guarda la nota con las imágenes y anotaciones
  saveNote() {
    if (this.noteForm.valid) {
      const noteData = this.noteForm.value;
      console.log('Nota guardada:', noteData);
      // Aquí puedes agregar lógica para guardar la nota
    }
  }
}

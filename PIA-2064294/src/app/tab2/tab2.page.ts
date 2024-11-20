import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader,IonTitle,IonToolbar,IonContent,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonItem,IonInput,IonLabel,IonTextarea,IonSelect,IonSelectOption,IonButton} from '@ionic/angular/standalone'; // Importa el módulo completo
import { NotaService } from '../nota.service';
import { Note } from '../Interfaces/note';
import { FotoServiceService } from '../foto-service.service'; // Importa el servicio FotoService
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,IonTitle,IonToolbar,IonContent,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonItem,IonInput,IonLabel,IonTextarea,
    IonSelect,IonSelectOption,NgIf,IonButton// Usa IonicModule para incluir todos los componentes de Ionic
  ],
})
export class Tab2Page {
  noteForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder, 
    private noteService: NotaService,
    private fotoService: FotoServiceService  // Inyectamos el servicio de fotos
  ) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],  // Este campo puede ser la URL de la imagen en base64
      color: ['#ffffff'],  // Color por defecto
    });
  }

  // Método para tomar una foto con la cámara
  async takePhoto() {
    try {
      // Llamamos a addNewToGallery pasando el argumento 'false' para isProfileImage,
      // ya que no es una imagen de perfil, y el objeto note que es opcional.
      await this.fotoService.addNewToGallery(false); // Asume que no es una imagen de perfil.
  
      // Asigna la foto capturada al formulario
      this.selectedImage = this.fotoService.photos[0].webviewPath || null;  // Si es undefined, asigna null.
 // Accede a la primera foto
      this.noteForm.patchValue({ image: this.selectedImage });  // Actualiza el formulario con la imagen
    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }
  

  // Método para manejar la selección de archivo (imagen)
  onFileSelected(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result; // Asigna la imagen seleccionada
        this.noteForm.patchValue({ image: reader.result });  // Actualiza el formulario con la imagen
      };
      reader.readAsDataURL(file);  // Lee la imagen en formato base64
    }
  }

  // Método para guardar la nota
  saveNote() {
    if (this.noteForm.valid) {
      const noteData: Note = this.noteForm.value;  // Obtiene los valores del formulario
      this.noteService.addNote(noteData);  // Llama al servicio para agregar la nueva nota
      console.log('Nota guardada:', noteData);

      // Reinicia el formulario después de guardar la nota
      this.noteForm.reset({ color: '#ffffff' });
      this.selectedImage = null;  // Limpia la imagen seleccionada
    }
  }
}

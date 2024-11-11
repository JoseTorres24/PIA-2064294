import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NotaService } from '../nota.service';
import { IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonSelectOption,IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, CommonModule, ReactiveFormsModule, IonTextarea, IonTitle, IonToolbar],
})
export class Tab2Page {
  noteForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private noteService: NotaService) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
      color: ['#ffadad'], // Color por defecto
    });
  }

  onFileSelected(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result;
        this.noteForm.patchValue({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  saveNote() {
    if (this.noteForm.valid) {
      const noteData = this.noteForm.value;
      this.noteService.addNote(noteData);
      console.log('Nota guardada:', noteData);
      this.noteForm.reset();
      this.selectedImage = null;
    }
  }
}

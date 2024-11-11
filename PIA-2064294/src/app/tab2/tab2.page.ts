// tab2.page.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule que incluye todos los componentes
import { CommonModule } from '@angular/common';
import { NotaService } from '../nota.service';
import { Note } from '../Interfaces/note';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // Importa solo IonicModule para evitar duplicados
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class Tab2Page {
  noteForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private noteService: NotaService) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
      color: ['#ffffff'],
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
      const noteData: Note = this.noteForm.value; 
      this.noteService.addNote(noteData);
      console.log('Nota guardada:', noteData);
      this.noteForm.reset({ color: '#ffffff' });
      this.selectedImage = null;
    }
  }
}

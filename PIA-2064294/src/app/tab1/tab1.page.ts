import { Component, OnInit } from '@angular/core';
import { NotaService } from '../nota.service';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons/';
import { NoteDetailComponent } from '../note-detail/note-detail.component';
import { Note } from '../Interfaces/note';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    NoteDetailComponent, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, 
    IonCardContent, IonButton, IonIcon, NgFor, NgIf, NgStyle
  ],
})
export class Tab1Page implements OnInit {
  notes: Note[] = [];  // Lista local para las notas
  notes$ = this.noteService.notes$; // Suscripción al observable

  constructor(private noteService: NotaService, private modalCtrl: ModalController) {
    addIcons({ trashOutline });
  }

  async ngOnInit() {
    try {
      this.noteService.notes$.subscribe(updatedNotes => {
        this.notes = updatedNotes; // Actualiza la lista local con los cambios en el servicio
      });
      await this.noteService.loadNotes(); // Carga inicial de las notas
    } catch (error) {
      console.error('Error al cargar notas:', error);
    }
  }
  
  
  async openNoteDetail(note: Note) {
    const modal = await this.modalCtrl.create({
      component: NoteDetailComponent,
      componentProps: { note },
    });
    return await modal.present();
  }

  deleteNote(index: number) {
    const noteID = this.notes[index].noteId;
    this.noteService.deleteNote(noteID)
      .then(() => {
        this.notes.splice(index, 1);
      })
      .catch(error => {
        console.error('Error al eliminar la nota:', error);
      });
  }
}


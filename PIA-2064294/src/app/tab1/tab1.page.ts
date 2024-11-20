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
    IonCardContent, IonButton, IonIcon, NgFor, NgIf, NgStyle,
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
      // Suscríbete al BehaviorSubject para mantener la lista local sincronizada
      this.noteService.notes$.subscribe(updatedNotes => {
        this.notes = updatedNotes; // Actualiza la lista local
      });
  
      // Carga inicial de las notas desde Firestore
      await this.noteService.loadNotes();
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
    if (index < 0 || index >= this.notes.length) {
      console.error('Índice fuera de rango:', index);
      return;
    }
  
    const noteID = this.notes[index]?.noteId;
    if (!noteID) {
      console.error('No se encontró un ID válido para la nota en la posición:', index);
      return;
    }
  
    this.noteService.deleteNote(noteID)
      .then(() => console.log(`Nota ${noteID} eliminada correctamente.`))
      .catch(error => console.error('Error al eliminar la nota:', error));
  }
  
  
  
}

//
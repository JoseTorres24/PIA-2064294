import { Component, OnInit } from '@angular/core';
import { NotaService } from '../nota.service';
import { ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons/';
import { NoteDetailComponent } from '../note-detail/note-detail.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [NoteDetailComponent, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, NgFor, NgIf, NgStyle],
})
export class Tab1Page implements OnInit {
  notes: any[] = [];

  constructor(private noteService: NotaService, private modalCtrl: ModalController) {
    addIcons({ trashOutline });
  }

  ngOnInit() {
    this.notes = this.noteService.getNotes();
  }

  async openNoteDetail(note: any) {
    const modal = await this.modalCtrl.create({
      component: NoteDetailComponent,
      componentProps: { note }, // Pasa la nota seleccionada al componente de detalle
    });
    return await modal.present();
  }

  deleteNote(index: number) {
    this.noteService.deleteNote(index);
    this.notes.splice(index, 1); // Elimina directamente el elemento de la lista
  }

  
}

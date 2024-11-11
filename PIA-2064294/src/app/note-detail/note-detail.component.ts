import { Component, Input, OnInit } from '@angular/core';
import { IonContent,IonButton,IonHeader,IonTitle,IonToolbar,IonButtons,IonCard,IonCardTitle,IonCardContent,IonCardHeader } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';


@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss'],
  standalone : true,
  imports:[IonContent,IonButton,IonHeader,IonTitle,IonToolbar,IonButtons,IonCard,IonCardTitle,IonCardContent,IonCardHeader, NgIf ]
})
export class NoteDetailComponent implements OnInit {
  @Input() note: any;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }
}

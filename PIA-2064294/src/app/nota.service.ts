import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  private notes: any[] = [];

  constructor() {}

  addNote(note: any) {
    this.notes.push(note);
  }

  getNotes() {
    return this.notes;
  }

  deleteNote(index: number) {
    this.notes.splice(index, 1);
  }
}




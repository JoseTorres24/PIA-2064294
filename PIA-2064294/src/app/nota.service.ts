import { Injectable } from '@angular/core';
import { Note } from './Interfaces/note';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  private notes: Note[] = [];

  constructor() {}

  addNote(note: Note) {
    this.notes.push(note);
    console.log('Nota añadida:', note);  // Verifica que el color esté presente en la salida de la consola
  }

  getNotes(): Note[] {
    return this.notes;
  }

  deleteNote(index: number) {
    this.notes.splice(index, 1);
  }
}


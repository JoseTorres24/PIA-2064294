import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, QuerySnapshot, DocumentData } from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';
import { Note } from './Interfaces/note';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  private notesSubject = new BehaviorSubject<Note[]>([]); // Observable para manejar las notas
  notes$ = this.notesSubject.asObservable(); // Exponerlo como observable

  constructor(private firestore: Firestore, private authService: AuthService) {}

  // Cargar las notas iniciales desde Firestore
  isValidHexColor(color: string): boolean {
    const hexRegex = /^#([0-9A-Fa-f]{6})$/; // Valida que sea un color hex de 6 caracteres
    return hexRegex.test(color);
  }
  
  async loadNotes(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }
  
    try {
      const notesQuery = query(
        collection(this.firestore, 'notes'),
        where('uid', '==', currentUser.uid)
      );
  
      const querySnapshot = await getDocs(notesQuery);
      const notes = querySnapshot.docs.map(doc => ({
        noteId: doc.id, // Asegúrate de asignar el ID del documento
        ...doc.data(), // Combina los datos restantes
      })) as Note[];
  
      this.notesSubject.next(notes); // Actualiza el BehaviorSubject
    } catch (error) {
      console.error('Error al cargar las notas:', error);
      throw error;
    }
  }
  
  
  

  // Obtener las notas actuales desde el BehaviorSubject o Firestore
  async getNotes(): Promise<Note[]> {
    const currentNotes = this.notesSubject.getValue(); // Obtén el estado actual de las notas
    if (currentNotes.length === 0) {
      await this.loadNotes(); // Carga las notas desde Firestore si aún no se han cargado
    }
    return this.notesSubject.getValue(); // Devuelve las notas más recientes
  }

  // Agregar una nueva nota asociada al UID del usuario
  async addNote(note: Note): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }
  
    try {
      // Valida el color antes de guardar
      if (!this.isValidHexColor(note.color)) {
        note.color = '#ffffff'; // Usa un color predeterminado si es inválido
      }
  
      const noteWithUid = { ...note, uid: currentUser.uid };
      const docRef = await addDoc(collection(this.firestore, 'notes'), noteWithUid);
      const addedNote = { ...noteWithUid, noteId: docRef.id }; // Asegura que tenga un ID
      const updatedNotes = [...this.notesSubject.getValue(), addedNote];
      this.notesSubject.next(updatedNotes);
    } catch (error) {
      console.error('Error al añadir la nota:', error);
      throw error;
    }
  }
  
  

  // Eliminar una nota usando su ID
  async deleteNote(noteId: string): Promise<void> {
    if (!noteId) {
      console.error('El ID de la nota es inválido o undefined.');
      return;
    }
  
    try {
      const docRef = doc(this.firestore, 'notes', noteId); // Construye la referencia
      await deleteDoc(docRef); // Elimina el documento de Firestore
      console.log(`Documento con ID ${noteId} eliminado correctamente.`);
  
      // Actualiza el BehaviorSubject para reflejar el cambio
      const updatedNotes = this.notesSubject
        .getValue()
        .filter(note => note.noteId !== noteId); // Filtra correctamente las notas
      this.notesSubject.next(updatedNotes);
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      throw error;
    }
  }
  
  
  
}

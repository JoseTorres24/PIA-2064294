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
  async loadNotes(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }
  
    try {
      const notesQuery = query(
        collection(this.firestore, 'notes'),
        where('uid', '==', currentUser.uid) // Filtrar por UID
      );
  
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(notesQuery);
  
      const notes = querySnapshot.docs.map(doc => {
        const data = doc.data() as Note; // Tipar los datos como 'Note'
        const { noteId, ...rest } = data; // Eliminar cualquier propiedad 'noteId' existente
        return { noteId: doc.id, ...rest }; // Asignar 'doc.id' a 'noteId'
      });
  
      this.notesSubject.next(notes); // Actualiza el BehaviorSubject con las nuevas notas
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
      const noteWithUid = { ...note, uid: currentUser.uid };
      const docRef = await addDoc(collection(this.firestore, 'notes'), noteWithUid);
      const addedNote = { ...noteWithUid, id: docRef.id }; // Incluye el ID del documento en la nota
      const updatedNotes = [...this.notesSubject.getValue(), addedNote]; // Agrega la nueva nota al BehaviorSubject
      this.notesSubject.next(updatedNotes); // Actualiza el observable
      console.log('Nota añadida:', addedNote);
    } catch (error) {
      console.error('Error al añadir la nota:', error);
      throw error;
    }
  }

  // Eliminar una nota usando su ID
  async deleteNote(noteId: string): Promise<void> {
    try {
      // Eliminar la nota de Firestore
      await deleteDoc(doc(this.firestore, 'notes', noteId));
  
      // Actualizar el BehaviorSubject eliminando la nota por 'noteId'
      const updatedNotes = this.notesSubject
        .getValue()
        .filter(note => note.noteId !== noteId); // Comparar correctamente el 'noteId'
  
      this.notesSubject.next(updatedNotes); // Actualizar el observable
      console.log(`Nota ${noteId} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      throw error;
    }
  }
  
  
}

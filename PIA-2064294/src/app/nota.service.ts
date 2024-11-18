import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { Note } from './Interfaces/note';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  // Agregar una nueva nota asociada al UID del usuario
  async addNote(note: Note): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }
  
    try {
      const noteWithUid = { ...note, uid: currentUser.uid };
      await addDoc(collection(this.firestore, 'notes'), noteWithUid);
      console.log('Nota añadida:', noteWithUid);
    } catch (error) {
      console.error('Error al añadir la nota:', error);
      throw error;
    }
  }
  
  

  // Obtener las notas asociadas al UID del usuario autenticado
  async getNotes(): Promise<Note[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }
  
    try {
      const notesQuery = query(
        collection(this.firestore, 'notes'),
        where('uid', '==', currentUser.uid) // Filtrar por UID
      );
      const querySnapshot = await getDocs(notesQuery);
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Note; // Asegúrate de que el objeto cumple con la interfaz Note
        return { id: doc.id, ...data };
      });
    } catch (error) {
      console.error('Error al obtener las notas:', error);
      throw error;
    }
  }
  

  // Eliminar una nota usando su ID
  async deleteNote(noteId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'notes', noteId));
      console.log(`Nota ${noteId} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      throw error;
    }
  }
}


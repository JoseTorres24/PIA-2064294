import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {}

  // Registrar usuario y guardar datos adicionales
  async register(userData: User): Promise<void> {
    const { email, password, ...otherData } = userData;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;// y esto lo dejamos?

      // Guardar datos adicionales en Firestore usando el UID
      const { uid: _, ...otherDataWithoutUid } = otherData;

      await setDoc(doc(this.firestore, 'users', uid), {
        uid, // Se asigna explícitamente
        email,
      ...otherDataWithoutUid, // Sin el campo uid
      });


      console.log('Usuario registrado:', userCredential.user);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  // Iniciar sesión y cargar datos del usuario
  async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      // Obtener datos del usuario usando el UID
      const userDoc = await getDoc(doc(this.firestore, 'users', uid));
      if (userDoc.exists()) {
        this.currentUser = userDoc.data() as User;
        console.log('Usuario autenticado:', this.currentUser);
        return this.currentUser;
      } else {
        console.error('No se encontraron datos del usuario.');
        return null;
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser = null;
      console.log('Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Obtener el usuario actual
  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

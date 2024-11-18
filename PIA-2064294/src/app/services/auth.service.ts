import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { User as FirebaseUser } from 'firebase/auth'; // Tipo de usuario de Firebase
import { User } from '../Interfaces/user'; // Tu tipo personalizado

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Si hay un usuario de Firebase, obtener los datos adicionales de Firestore
        const userDoc = await getDoc(doc(this.firestore, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          // Puedes asignar las propiedades adicionales a un objeto de tipo User
          const firestoreUser = userDoc.data() as User;
          this.currentUser = {
            ...firestoreUser,
            uid: firebaseUser.uid, // Asegúrate de agregar el UID de Firebase
            email: firebaseUser.email || '', // Puedes agregar el email si lo deseas
          };
        } else {
          this.currentUser = null; // No se encontraron datos del usuario en Firestore
        }
      } else {
        this.currentUser = null; // No hay usuario autenticado
      }
    });
  }

  // Registrar usuario y guardar datos adicionales
  async register(userData: User): Promise<void> {
    const { email, password, ...otherData } = userData;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      // Guardar datos adicionales en Firestore
      const { uid: _, ...otherDataWithoutUid } = otherData;

      await setDoc(doc(this.firestore, 'users', uid), {
        uid, // Asigna UID explícitamente
        email,
        ...otherDataWithoutUid, // Otros datos sin el UID
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

      // Obtener los datos del usuario desde Firestore utilizando el UID
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
    return this.currentUser; // Retorna el usuario almacenado en `currentUser`
  }
}


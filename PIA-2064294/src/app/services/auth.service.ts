//auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { User as FirebaseUser } from 'firebase/auth'; // Tipo de usuario de Firebase
import { User } from '../Interfaces/user'; // Tu tipo personalizado
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: User | null = null;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(this.firestore, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const firestoreUser = userDoc.data() as User;
          this.currentUser = {
            ...firestoreUser,
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
          };
        } else {
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
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
  
      const userDoc = await getDoc(doc(this.firestore, 'users', uid));
      if (userDoc.exists()) {
        this.currentUser = userDoc.data() as User;
        console.log('Usuario autenticado:', this.currentUser);
  
        // Redirigir al usuario a los tabs y limpiar el historial
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
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
  
      // Redirigir al inicio de sesión y limpiar historial
      this.router.navigateByUrl('/iniciar-sesion', { replaceUrl: true });
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


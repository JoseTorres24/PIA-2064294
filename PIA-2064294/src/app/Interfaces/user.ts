export interface User {
    username: string;
    email: string;
    password: string;
    age: number;
    profileImage?: string | ArrayBuffer | null; // Opcional para la imagen
  }
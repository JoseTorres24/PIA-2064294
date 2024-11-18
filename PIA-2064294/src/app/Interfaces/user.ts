export interface User {
    uid:string; // Para saber el usuario, la usamos como id para evitarnos usar mas parametros
    username: string;
    email: string;
    password: string;
    age: number;
    profileImage?: string | ArrayBuffer | null; // Opcional para la imagen
  }
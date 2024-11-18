export interface Note {
    noteId:string;
    title: string;
    description: string;
    image?: string | ArrayBuffer | null;
    color: string;
    uid:string; //referencia del usuario
  }
  
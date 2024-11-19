import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { User } from './Interfaces/user';
import { Note } from './Interfaces/note';

@Injectable({
  providedIn: 'root',
})
export class FotoServiceService {
  public photos: UserPhoto[] = []; // Cambiado a UserPhoto[] en lugar de [] (arreglo vacío)
  private PHOTO_STORAGE: string = 'photos'; // Clave de almacenamiento

  constructor() {}

  /**
   * Toma una nueva foto y la guarda tanto en el sistema de archivos como en las preferencias del dispositivo.
   * @param isProfileImage - Indica si la foto es para el perfil del usuario (si no, se asocia con una nota).
   * @param user - Usuario al que se le asignará la imagen de perfil si es el caso.
   * @param note - Nota a la que se asociará la imagen si no es una imagen de perfil.
   */
  public async addNewToGallery(isProfileImage: boolean, user?: User, note?: Note) {
    // Toma la foto
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    // Guarda la foto en el sistema de archivos
    const savedImageFile = await this.savePicture(capturedPhoto);

    // Si es una imagen de perfil, actualiza el perfil del usuario
    if (isProfileImage && user) {
      user.profileImage = savedImageFile.webviewPath;
      Preferences.set({
        key: 'userProfile',
        value: JSON.stringify(user),
      });
    } 
    // Si es una foto asociada a una nota
    else if (note) {
      note.image = savedImageFile.webviewPath;
      Preferences.set({
        key: 'noteImages',
        value: JSON.stringify(note),
      });
    }

    // Actualiza las fotos almacenadas en las preferencias
    this.photos.unshift(savedImageFile); // Ahora 'photos' es un arreglo de UserPhoto
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  /**
   * Convierte la foto en un formato base64 y la guarda en el sistema de archivos.
   * @param photo - La foto capturada que se va a guardar.
   * @returns Retorna la ruta de la foto guardada.
   */
  private async savePicture(photo: Photo): Promise<UserPhoto> {
    // Convierte la foto a formato base64 para guardarla en el sistema de archivos
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = await this.convertBlobToBase64(blob) as string;

    // Genera un nombre de archivo único
    const fileName = new Date().getTime() + '.jpeg';

    // Guarda la foto en el sistema de archivos
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Retorna la información de la foto guardada
    return {
      filepath: savedFile.uri,
      webviewPath: photo.webPath,
    };
  }

  /**
   * Convierte un Blob de datos binarios a base64.
   * @param blob - El Blob que se convertirá a base64.
   * @returns Promesa que resuelve el resultado en formato base64.
   */
  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

/**
 * Interfaz de tipo para la foto guardada
 */
export interface UserPhoto {
  filepath: string; // Ruta del archivo guardado en el sistema de archivos
  webviewPath: string | undefined; // Ruta accesible desde la web
}

# Aplicación de Notas

## Descripción

**Aplicación de Notas** es un proyecto móvil desarrollado utilizando **Angular/Ionic** con el enfoque **standalone** de Angular. Esta aplicación permite a los usuarios gestionar sus notas de manera muy basica, ademas que esta permite un inicio de sesion & cerrar sesion, dentro de la aplicacion. Se integró Firebase para la autenticación, almacenamiento y gestión de datos, utilizando Firestore como base de datos no relacional.

El objetivo principal fue crear una solución ligera, moderna y fácilmente extensible, aprovechando las capacidades de Ionic para el desarrollo móvil multiplataforma.

## Tecnologías Utilizadas

- **Angular**: Framework principal para el desarrollo del frontend (enfoque standalone).
- **Ionic**: Framework utilizado para la creación de la interfaz de usuario y funcionalidad móvil.
- **Firebase**: Plataforma utilizada para backend:
  - **FireAuth**: Gestión de usuarios y autenticación.
  - **Firestore**: Base de datos no relacional para el almacenamiento de notas.

## Características del Proyecto

- Gestión de notas personales (crear, leer, actualizar y eliminar).
- Autenticación de usuarios con Firebase (correo electrónico/contraseña).
- Sincronización en tiempo real de las notas con Firestore.
- Diseño responsivo y atractivo adaptado para dispositivos móviles.
- Fácil extensibilidad gracias a la arquitectura standalone de Angular.

## Instalación

Para ejecutar este proyecto, sigue los pasos a continuación:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/aplicacion-notas.git
   cd aplicacion-notas
2. Instalar dependencias:
  Asegúrate de tener instalado Node.js y npm. Luego, instala las dependencias del proyecto:
    ```bash
      npm install.
3. Configurar Firebase:
  Crea un proyecto en Firebase.
  Habilita Authentication (correo electrónico/contraseña) y Firestore.
  Genera las credenciales de tu proyecto desde el panel de Firebase.
  Crea un archivo src/environments/environment.ts con la siguiente estructura:
    ```bash
    export const environment = {
    production: false,
    firebase: {
      apiKey: "TU_API_KEY",
      authDomain: "TU_AUTH_DOMAIN",
      projectId: "TU_PROJECT_ID",
      storageBucket: "TU_STORAGE_BUCKET",
      messagingSenderId: "TU_MESSAGING_SENDER_ID",
      appId: "TU_APP_ID",
      measurementId: "TU_MEASUREMENT_ID",
      }
    };
    
4. Ejecutar la aplicación en el navegador:
  Para iniciar un servidor de desarrollo y probar la aplicación en tu navegador:
    ```bash
    ionic serve
  Accede a la aplicación en **http://localhost:8100/**.

5. Ejecutar en un dispositivo móvil (opcional):
  Si deseas probar la aplicación en un dispositivo móvil:
  Asegúrate de tener instaladas las herramientas necesarias (como Android Studio para Android o Xcode para iOS).
  Añade la plataforma móvil:
    ```bash
    ionic capacitor add android
  Compila y ejecuta la aplicación:
  ```bash
    ionic capacitor run android

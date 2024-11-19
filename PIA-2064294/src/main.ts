import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({"projectId":"apptusnotas","appId":"1:839339332082:web:bd35899ed068b2b52d5b6b","storageBucket":"apptusnotas.firebasestorage.app","apiKey":"AIzaSyCpBcq7bxhn2HkmOgttzfiYtQeB-qJ4GMM","authDomain":"apptusnotas.firebaseapp.com","messagingSenderId":"839339332082"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
 ] }).then(() => {
    defineCustomElements(window);
});

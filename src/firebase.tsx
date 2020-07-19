import * as firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAB-jJ1vPnYCy0meyJYmjYNZSLJmro-7hI",
    authDomain: "vibe-check-263f6.firebaseapp.com",
    databaseURL: "https://vibe-check-263f6.firebaseio.com",
    projectId: "vibe-check-263f6",
    storageBucket: "vibe-check-263f6.appspot.com",
    messagingSenderId: "975555934613",
    appId: "1:975555934613:web:3f530706f9722c73339e9c"
});

const db = firebaseApp.firestore();

export { db };
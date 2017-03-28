const firebase = require('firebase');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBvTyYRgyYc5gwtL-8Jam3zZbSmz5BiK6E",
    authDomain: "scrumboard-ab551.firebaseapp.com",
    databaseURL: "https://scrumboard-ab551.firebaseio.com",
    storageBucket: "scrumboard-ab551.appspot.com",
    messagingSenderId: "467416590233"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
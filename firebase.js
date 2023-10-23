const firebase = require('firebase/app')

const firebaseConfig = {
    apiKey: "AIzaSyAS2AV81ilEC7L6Z9a0HDX7B_gafTLzo6s",
    authDomain: "inertia-ed09e.firebaseapp.com",
    projectId: "inertia-ed09e",
    storageBucket: "inertia-ed09e.appspot.com",
    messagingSenderId: "268454047886",
    appId: "1:268454047886:web:d6ac73cb62e05ba9c399df",
    measurementId: "G-XCGD7YPW6J"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

module.exports = {firebaseApp}
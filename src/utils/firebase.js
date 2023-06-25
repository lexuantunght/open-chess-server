const firebase = require('firebase-admin');
const credentials = require('../../../firebase.cert.json');

firebase.initializeApp({
    credential: firebase.credential.cert(credentials),
    databaseURL: process.env.FIREBASE_DB_URL,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
});

module.exports = firebase;
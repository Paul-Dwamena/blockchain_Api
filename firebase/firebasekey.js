var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyDRgf_KE-sSIM3KsA4OPGYM19RSE1yWNbM",
    authDomain: "land-4a99b.firebaseapp.com",
    databaseURL: "https://land-4a99b.firebaseio.com",
    projectId: "land-4a99b",
    storageBucket: "land-4a99b.appspot.com",
    messagingSenderId: "51122920462"
};
firebase.initializeApp(config);

export {firebase};

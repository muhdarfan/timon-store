import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAsKTjPbT4gBRjiRZhNjHZTOuVhTc1RhQQ",
    authDomain: "timon-store.firebaseapp.com",
    projectId: "timon-store",
    storageBucket: "timon-store.appspot.com",
    messagingSenderId: "77248978800",
    appId: "1:77248978800:web:bd6147b97eba6b2263f9b5",
    measurementId: "G-R72E4QV6G0"
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);

        this.auth = app.auth();
        this.db = app.database();
        this.store = app.firestore();
        this.storage = app.storage();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    user = uid => this.db.ref(`users/${uid}`);
    products = () => this.store.collection("products");
}

export default Firebase;

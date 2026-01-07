import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { Platform } from 'react-native';

// Replace with your actual project config if you have one.
// For Emulators, these values don't need to be real.
const firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "testapp-backend-security", // Matches our test environment
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'asia-south1'); // Matches our functions region

// Emulator Connection Logic
// Automatically configured for physical device access
// 10.0.2.2 is usually for Android Emulator on same machine, but physical device needs LAN IP.
const EMULATOR_HOST = '10.133.228.48';

if (__DEV__) {
    console.log(`🔌 Connecting to Firebase Emulators at ${EMULATOR_HOST}`);
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`);
    connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
    connectFunctionsEmulator(functions, EMULATOR_HOST, 5001);
}

export { auth, db, functions };

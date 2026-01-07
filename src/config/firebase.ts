import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "demo-api-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "testapp-backend-security",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'asia-south1');

// Emulator support
if (__DEV__) {
    // 10.0.2.2 is the special alias to your host loopback interface (i.e., localhost) on the Android emulator
    const EMULATOR_HOST = '10.0.2.2';
    console.log(`🔌 Connecting to Firebase Emulators at ${EMULATOR_HOST}`);
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`);
    connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
    connectFunctionsEmulator(functions, EMULATOR_HOST, 5001);
}

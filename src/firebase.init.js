import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyEnTyHWI5iPVNRaoMN4rLtdofM8XPBRw",
  authDomain: "fir-authentication-a52d1.firebaseapp.com",
  projectId: "fir-authentication-a52d1",
  storageBucket: "fir-authentication-a52d1.appspot.com",
  messagingSenderId: "151191596191",
  appId: "1:151191596191:web:bbb6868b495ab5f55d46aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
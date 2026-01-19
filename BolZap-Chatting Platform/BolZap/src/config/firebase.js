// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword  } from "firebase/auth";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBH0t6BeYyl3TrSia67yDD_06SYE5uD4gM",
  authDomain: "bolzap.firebaseapp.com",
  projectId: "bolzap",
  storageBucket: "bolzap.firebasestorage.app",
  messagingSenderId: "678354015284",
  appId: "1:678354015284:web:e0e9ccf143ee6ce81ba661",
  measurementId: "G-KP95DXEQRK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password)=>{
    try {
        console.log("Signup CAlled")
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username : username.toLowerCase(),
            email,
            name : "",
            avatar : "",
            bio : "Hey, There I am using BolZap",
            lastSeen : Date.now()
        })
        await setDoc(doc(db, "chats", user.uid), {
            chatData : []
        })
    }
    catch(error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email, password);
    }
    catch(error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
    try{
          await signOut(auth)
    }
    catch(error) {
          console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    
    } 
}

const resetPass =async(email) => {
    if(!email) {
        toast.error("Enter the email!")
        return null;
    }
    try {
        const userRef = collection(db,'users');
        const q = query(userRef, where("emeail","==",email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent.")
        }
        else {
            toast.error("Email doesn't exist")
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
}
export {signup, login, logout, auth, db, resetPass}

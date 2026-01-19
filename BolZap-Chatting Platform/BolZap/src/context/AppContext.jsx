import { getDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const navigate = useNavigate();
    const [chatVisible, setChatVisible] = useState(false);

    const loadUserData = async (uid) => {
        if (!uid) return;

        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return;

            const data = userSnap.data();
            setUserData({ ...data, id: uid });

            if (data.avatar && data.name) {
                navigate("/chat");
            } else {
                navigate("/profile");
            }

            await updateDoc(userRef, { lastSeen: Date.now() });

            setInterval(async () => {
                if (auth.currentUser) {
                    await updateDoc(userRef, { lastSeen: Date.now() });
                }
            }, 60000);

        } catch (error) {
            console.error("loadUserData failed:", error);
        }
    };


    useEffect(() => {
        if (!userData?.id) return;

        const chatRef = doc(db, "chats", userData.id);
        const unsub = onSnapshot(chatRef, async (res) => {
            const chatItems = res.data()?.chatData || [];
            const tempData = [];

            for (const item of chatItems) {
                const userRef = doc(db, "users", item.rId);
                const userSnap = await getDoc(userRef);
                tempData.push({ ...item, userData: userSnap.data() });
            }

            setChatData(
                tempData.sort((a, b) => b.updatedAt - a.updatedAt)
            );
        });

        return () => unsub();
    }, [userData]);


    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData,
        chatUser, setChatUser,
        messagesId, setMessagesId,
        messages, setMessages,
        chatVisible, setChatVisible

    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;
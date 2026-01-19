import {
  arrayUnion, setDoc, collection, doc,
  getDoc, getDocs, query,
  serverTimestamp, updateDoc, where
} from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { db, logout } from "../../config/firebase"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const LeftSideBar = () => {

  const navigate = useNavigate()
  const {
    userData, chatData,
    setChatUser, messagesId, setMessagesId,
    chatVisible, setChatVisible
  } = useContext(AppContext)

  const [user, setUser] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  const inputHandler = async (e) => {
    try {
      const input = e.target.value
      if (!input) return setShowSearch(false)

      setShowSearch(true)
      const q = query(
        collection(db, 'users'),
        where("username", "==", input.toLowerCase())
      )
      const snap = await getDocs(q)

      if (!snap.empty && snap.docs[0].data().id !== userData.id) {
        const exists = chatData.some(c => c.rId === snap.docs[0].data().id)
        if (!exists) setUser(snap.docs[0].data())
      } else {
        setUser(null)
      }
    } catch {}
  }

  const addChat = async () => {
    try {
      const messagesRef = collection(db, "messages")
      const chatsRef = collection(db, "chats")
      const newMsgRef = doc(messagesRef)

      await setDoc(newMsgRef, {
        createAt: serverTimestamp(),
        messages: []
      })

      await updateDoc(doc(chatsRef, user.id), {
        chatData: arrayUnion({
          messageId: newMsgRef.id,
          lastMessage: "",
          rId: userData.id,
          updateAt: Date.now(),
          messageSeen: true
        })
      })

      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMsgRef.id,
          lastMessage: "",
          rId: user.id,
          updateAt: Date.now(),
          messageSeen: true
        })
      })

      setChatUser({
      messageId: newMsgRef.id,
      rId: user.id,
      userData: user
    })
    setMessagesId(newMsgRef.id)
    setChatVisible(true)
    setShowSearch(false)
    } catch {}
  }

  const setChat = async (item) => {
    try {
      setChatUser(item)
      setMessagesId(item.messageId)
      setChatVisible(true) 

      const ref = doc(db, 'chats', userData.id)
      const snap = await getDoc(ref)
      const data = snap.data()

      const idx = data.chatData.findIndex(c => c.messageId === item.messageId)
      data.chatData[idx].messageSeen = true

      await updateDoc(ref, { chatData: data.chatData })
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
  <div
  className={`
    h-full
    bg-slate-950
    flex flex-col
    w-full
    sm:w-[320px]
    lg:w-[360px]
    rounded-none
    sm:rounded-l-3xl
    flex-shrink-0
    ${chatVisible ? "hidden sm:flex" : "flex"}
  `}
>

      {/* TOP */}
      <div className="bg-[#0F172A] p-3">
        <div className="flex justify-between items-center">
          <img src="/bolzap-logo.svg" className="h-12 sm:h-14" alt="" />

          <div className="relative group">
            <img src="/menu_icon.png" className="w-6 h-6 cursor-pointer" />
            <div className="absolute right-0 mt-2 w-40 bg-white text-black p-3 rounded-xl shadow-lg hidden group-hover:block z-50">
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              >
                Edit Profile
              </p>
              <hr className="my-1" />
              <p onClick={()=>logout()} className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mt-3">
          <img src="/search_icon.png" className="absolute left-3 top-2.5 w-5" />
          <input
            onChange={inputHandler}
            placeholder="Search here..."
            className="
              w-full
              h-10
              pl-10
              rounded-xl
              bg-blue-950
              text-gray-300
              text-sm
            "
          />
        </div>
      </div>

      {/* LIST */}
      <div className="
        flex-1
        overflow-y-auto
        hide-scrollbar
        p-2
        space-y-2
      ">
        {showSearch && user ? (
          <div
            onClick={addChat}
            className="
              p-2
              flex items-center gap-3
              rounded-xl
              bg-[#0F172A]
              hover:bg-blue-800
              cursor-pointer
            "
          >
            <img src={user.avatar} className="w-10 h-10 rounded-full" />
            <p className="text-white font-bold">{user.name}</p>
          </div>
        ) : (
          chatData.map((item, index) => {
            const isActive = item.messageId === messagesId
            const isUnread = !item.messageSeen && !isActive

            return (
              <div
                key={index}
                onClick={() => setChat(item)}
                className={`
                  p-2 flex items-center gap-3 rounded-xl cursor-pointer transition
                  ${
                    isActive
                      ? "bg-blue-800"
                      : isUnread
                      ? "bg-[#0F1F3A]"
                      : "bg-[#0F172A] hover:bg-blue-800"
                  }
                `}
              >
                <div className="relative">
                  <img src={item.userData.avatar} className="w-10 h-10 rounded-full" />
                  {isUnread && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="flex flex-col text-white min-w-0">
                  <p className={`truncate ${isUnread ? "font-extrabold" : "font-bold"}`}>
                    {item.userData.name}
                  </p>
                  <span className="text-xs text-gray-400 truncate">
                    {item.lastMessage}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default LeftSideBar

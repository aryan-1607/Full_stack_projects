import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from "react-toastify"
import { upload } from '../../lib/upload'

const Chatbox = () => {
  const { userData, chatUser, messagesId, messages, setMessages, chatVisible, setChatVisible } =
    useContext(AppContext)

  const [input, setInput] = useState("")

  const sendMessageForLast = async () => {
    try {
      if (!input || !messagesId) return

      await updateDoc(doc(db, 'messages', messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          text: input,
          createdAt: new Date()
        })
      })

      const userIds = [chatUser.rId, userData.id]
      userIds.forEach(async (id) => {
        const ref = doc(db, 'chats', id)
        const snap = await getDoc(ref)
        if (!snap.exists()) return

        const data = snap.data()
        const idx = data.chatData.findIndex(c => c.messageId === messagesId)
        data.chatData[idx].lastMessage = input.slice(0, 30)
        data.chatData[idx].updatedAt = Date.now()
        if (data.chatData[idx].rId === userData.id) {
          data.chatData[idx].messageSeen = false
        }

        await updateDoc(ref, { chatData: data.chatData })
      })

      setInput("")
    } catch (error) {
      toast.error(error.message)
    }
  }

  const convertTimeStamp = (timeStamp) => {
    if (!timeStamp) return ""
    const date = timeStamp.toDate()
    let h = date.getHours()
    const m = date.getMinutes().toString().padStart(2, "0")
    const ap = h >= 12 ? "PM" : "AM"
    h = h % 12 || 12
    return `${h}:${m} ${ap}`
  }

  const sendImage = async (e) => {
    try {
      const url = await upload(e.target.files[0])
      if (!url || !messagesId) return

      await updateDoc(doc(db, 'messages', messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          image: url,
          createdAt: new Date()
        })
      })
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!messagesId) return
    return onSnapshot(doc(db, "messages", messagesId), (res) => {
      setMessages(res.data().messages)
    })
  }, [messagesId])

  /* ================= EMPTY STATE ================= */
  if (!chatUser) {
    return (
      // <div className={` ${chatVisible? "  flex-1 hidden sm:flex items-center justify-center      relative      overflow-hidden      bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100    ": "hidden"}
      // `}>
      <div className=' flex-1 hidden sm:flex items-center justify-center      relative      overflow-hidden      bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100    '>
        {/* floating background blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-6rem] right-[-6rem] w-96 h-96 bg-indigo-300/40 rounded-full blur-3xl animate-pulse delay-300" />

        {/* main content */}
        <div className="
        relative z-10
        flex flex-col items-center
        gap-6
        text-center
        px-6
        animate-fadeIn
      ">
          {/* icon bubble */}
          <div className="
          w-20 h-20
          flex items-center justify-center
          rounded-full
          bg-white/80
          shadow-xl
          backdrop-blur
          animate-bounceSlow
        ">
            <span className="text-4xl">💬</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Welcome to BolZap
          </h1>

          <p className="text-slate-600 max-w-md leading-relaxed">
            Pick a conversation from the sidebar or search for someone to start chatting instantly.
          </p>

          {/* feature chips */}
          <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500 mt-2">
            <span className="px-3 py-1 bg-white/70 rounded-full shadow">
              Fast
            </span>
            <span className="px-3 py-1 bg-white/70 rounded-full shadow">
              Secure
            </span>
            <span className="px-3 py-1 bg-white/70 rounded-full shadow">
              Simple
            </span>
          </div>
        </div>
      </div>
    )
  }


  /* ================= CHAT ================= */
  return (
    <div className={`
  flex-1
  flex flex-col
  bg-white
  relative
  ${chatVisible ? "flex" : "hidden sm:flex"}
`}>

      {/* HEADER */}
      <div className="
        flex items-center justify-between
        px-3 py-2
        border-b
      ">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={chatUser.userData.avatar}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
            alt=""
          />
          <div className="truncate">
            <p className="font-semibold truncate">
              {chatUser.userData.name}
            </p>
          </div>
        </div>
        {/* HELP ICON — desktop only */}
        <img
          src="help_icon.png"
          className="hidden sm:block w-6 h-6"
          alt=""
        />

        {/* BACK ICON — phone only */}
        <img
          onClick={() => setChatVisible(false)}
          src="arrow_icon.png"
          className="sm:hidden w-6 h-6 cursor-pointer"
          alt=""
        />
      </div>

      {/* MESSAGES */}
      <div className="
        flex-1
        overflow-y-auto
        px-3 py-2
        space-y-4
        pb-24
      ">
        {messages.map((msg, index) => {
          const isSender = msg.sId === userData.id

          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  flex gap-2
                  max-w-[85%] sm:max-w-[70%]
                  ${isSender ? "flex-row-reverse" : ""}
                `}
              >
                <img
                  src={isSender ? userData.avatar : chatUser.userData.avatar}
                  className="w-7 h-7 rounded-full shrink-0"
                  alt=""
                />

                <div className={`flex flex-col ${isSender ? "items-end" : ""}`}>
                  {msg.image ? (
                    <img
                      src={msg.image}
                      className="max-w-[220px] sm:max-w-xs rounded-2xl"
                      alt=""
                    />
                  ) : (
                    <p
                      className={`
                        px-4 py-2
                        rounded-2xl text-sm break-words
                        ${isSender
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-gray-200 text-gray-900 rounded-bl-sm"}
                      `}
                    >
                      {msg.text}
                    </p>
                  )}

                  <span className="text-xs text-gray-400 mt-1">
                    {convertTimeStamp(msg.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* INPUT */}
      <div className="
        absolute bottom-0 left-0 right-0
        bg-white
        border-t
        px-3 py-2
        flex items-center gap-3
      ">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send message"
          className="
            flex-1
            px-4 py-2
            rounded-full border
            outline-none
            focus:border-blue-500
          "
        />

        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
          onChange={sendImage}
        />

        <label htmlFor="image" className="cursor-pointer">
          <img src="gallery_icon.png" className="w-6 h-6" alt="" />
        </label>

        <img
          onClick={sendMessageForLast}
          src="send_button.png"
          className="w-6 h-6 cursor-pointer"
          alt=""
        />
      </div>
    </div>
  )
}

export default Chatbox

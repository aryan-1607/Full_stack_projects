import React, { useEffect, useContext, useState } from 'react'
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
import RightSideBar from '../../components/RightSideBar/RightSideBar'
import Chatbox from '../../components/Chatbox/Chatbox'
import { AppContext } from '../../context/AppContext'

const Chat = () => {
  const { userData, chatData } = useContext(AppContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userData && chatData) setLoading(false)
  }, [userData, chatData])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-600 p-2 sm:p-4 flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center gap-4 bg-white/40 backdrop-blur-lg px-10 py-8 rounded-3xl shadow-2xl">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
            <span className="w-3 h-3 bg-indigo-500 rounded-full animate-ping delay-150" />
            <span className="w-3 h-3 bg-sky-500 rounded-full animate-ping delay-300" />
          </div>
          <p className="text-sm font-medium text-slate-800">Setting things up…</p>
        </div>
      ) : (
        <div className="
          h-[95vh]
          w-full max-w-[1400px]
          flex
          rounded-3xl
          overflow-hidden
          shadow-2xl shadow-slate-950
        ">
          <LeftSideBar />
          <Chatbox />
          <RightSideBar />
        </div>
      )}
    </div>
  )
}

export default Chat

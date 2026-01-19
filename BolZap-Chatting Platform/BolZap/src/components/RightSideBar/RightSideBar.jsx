import React, { useContext, useEffect, useState } from 'react'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'

const RightSideBar = () => {
  const { chatUser, messages } = useContext(AppContext)
  const [msgImages, setMessageImages] = useState([])

  useEffect(() => {
    const imgs = messages
      .filter(msg => msg.image)
      .map(msg => msg.image)
    setMessageImages(imgs)
  }, [messages])

  return (
    <div className="
      hidden xl:flex
      h-full
      w-[300px] xl:w-[340px]
      bg-[#0F172A]
      text-white
      p-6
      relative
      flex-col
      rounded-tr-3xl rounded-br-3xl
      flex-shrink-0
    ">
      {chatUser && (
        <>
          {/* PROFILE */}
          <div className="flex flex-col items-center text-center">
            <img
              src={chatUser.userData.avatar}
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-600 shadow-lg mb-3"
              alt=""
            />

            <h3 className="flex items-center gap-2 font-bold text-xl">
              {chatUser.userData.name}
              {Date.now() - chatUser.userData.lastSeen <= 70000 && (
                <img src="green_dot.png" alt="" />
              )}
            </h3>

            <p className="mt-1 text-sm text-gray-400 max-w-xs">
              {chatUser.userData.bio}
            </p>
          </div>

          <hr className="my-5 border-slate-700" />

          {/* MEDIA */}
          <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
            <p className="text-sm font-semibold text-gray-300 mb-3 text-center">
              Shared Media
            </p>

            <div className="grid grid-cols-3 gap-3 px-1">
              {msgImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  onClick={() => window.open(url)}
                  className="
                    w-full h-20 object-cover rounded-xl
                    cursor-pointer
                    hover:scale-105 transition-transform
                  "
                  alt=""
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="
          absolute bottom-6 left-6 right-6
          bg-blue-600 hover:bg-blue-500
          active:scale-95
          transition-all
          text-lg font-semibold
          rounded-full py-2
          shadow-lg
          cursor-pointer
        "
      >
        Logout
      </button>
    </div>
  )
}

export default RightSideBar

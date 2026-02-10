import { useState, useEffect } from 'react'
import './App.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Navbar from './component/Navbar'
import Manager from './component/Manager'
import Passwords from './component/Passwords'
import { counterContext } from './context/context'

function App() {
  const [form, setform] = useState({ site: "", username: "", password: "" })
  const [passkeyArray, setPasskeyArray] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem("passwords");
    if (stored) {
      setPasskeyArray(JSON.parse(stored));
    }
  }, []);

  const router = createHashRouter([
    {
      path: '/',
      element: <><Navbar /> <Manager /></>
    },
    {
      path: '/passwords',
      element: <><Navbar /><Passwords /></>
    }
  ])

  return (
    <div className='fixed w-full h-full inset-0 overflow-auto [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] text-white'>
      <counterContext.Provider value={{ form, setform, passkeyArray, setPasskeyArray }}>
        <RouterProvider router={router} />
      </counterContext.Provider>
    </div>
  )
}

export default App
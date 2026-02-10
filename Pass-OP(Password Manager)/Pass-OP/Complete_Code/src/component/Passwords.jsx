import React, { useContext, useRef, useEffect } from 'react';
import { counterContext } from '../context/context';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import eyeopen from './img/eyeopen.png';
import eyeclosed from './img/eyeclosed.png';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Passwords = () => {
  const {
    passkeyArray,
    setPasskeyArray,
    form,
    setform
  } = useContext(counterContext);

  const gref = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    let passkeys = localStorage.getItem("passwords");
    if (passkeys) {
      setPasskeyArray(JSON.parse(passkeys));
    }
  }, []);

  const handlePasswords = () => {
    if (!form.site || !form.username || !form.password) {
      toast.error("Please fill out all fields");
      return;
    }

    setform({password : "",username: "", site: "" }); // reset form
    setPasskeyArray([...passkeyArray, { ...form, id: uuidv4() }]);
    localStorage.setItem("passwords", JSON.stringify([...passkeyArray, { ...form, id: uuidv4() }]));
    toast.success('Password saved successfully');
  };

  const deletePassword = (id) => {
    let c = confirm("Do you really want to Delete this information?")
    if (c) {
      setPasskeyArray(passkeyArray.filter(item => item.id !== id));
      localStorage.setItem("passwords", JSON.stringify(passkeyArray.filter(item => item.id !== id)));
      toast.success('Password deleted successfully');
    }
  }

  const editPassword = (id) => {
    console.log("Editing With Id")
    setform(passkeyArray.filter(i => i.id === id)[0])
    setPasskeyArray(passkeyArray.filter(item => item.id !== id));
  }

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to Clipboard!');
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <>
      <ToastContainer />

      {/* Header and Form Section - Fully Responsive */}
      <div className="text-white w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center items-center mb-2 sm:mb-4">
            <span className="text-transparent bg-clip-text animate-shine text-2xl sm:text-3xl lg:text-4xl"
              style={{ backgroundImage: "linear-gradient(90deg, #0f172a 0%, #00bcd4 50%, #0f172a 100%)" }}
            >
              &lt;
            </span>
            <span className="text-white animate-shine text-2xl sm:text-3xl lg:text-4xl">Pass</span>
            <span className="text-transparent bg-clip-text animate-shine text-2xl sm:text-3xl lg:text-4xl"
              style={{ backgroundImage: "linear-gradient(90deg, #0f172a 0%, #00bcd4 50%, #0f172a 100%)" }}
            >
              OP/&gt;
            </span>
          </div>
          <div className="text-gray-300 text-sm sm:text-base lg:text-lg">Your own Password Manager</div>
        </div>

        {/* Form inputs - Mobile-First Responsive */}
        <div className="inputs flex flex-col space-y-4 text-black mb-6 sm:mb-8">
          {/* Site URL Input */}
          <input
            name="site"
            value={form.site}
            onChange={handleChange}
            type="text"
            className="bg-white rounded-lg p-3 sm:p-4 transition-all opacity-30 hover:opacity-100 focus:opacity-100 w-full text-sm sm:text-base"
            placeholder="Enter the URL"
          />
          
          {/* Username and Password Row - Responsive Layout */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Username Input */}
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              type="text"
              className="bg-white w-full sm:flex-1 lg:flex-[2] rounded-lg p-3 sm:p-4 transition-all opacity-30 hover:opacity-100 focus:opacity-100 text-sm sm:text-base"
              placeholder="Enter the username"
            />
            
            {/* Password Input with Eye Icon */}
            <div className="w-full sm:flex-1 relative">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                ref={passwordRef}
                type="password"
                className="bg-white w-full rounded-lg p-3 sm:p-4 pr-12 transition-all opacity-30 hover:opacity-100 focus:opacity-100 text-sm sm:text-base"
                placeholder="Enter the password"
              />
              <img
                ref={gref}
                onClick={() => {
                  if (gref.current.src.includes("eyeclosed")) {
                    gref.current.src = eyeopen;
                    passwordRef.current.type = "text";
                  } else {
                    gref.current.src = eyeclosed;
                    passwordRef.current.type = "password";
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                src={eyeclosed}
                alt="Toggle Visibility"
              />
            </div>
          </div>
        </div>

        {/* Add Password Button */}
        <div className="text-center mb-8 sm:mb-12">
          <Link
            to="/passwords"
            onClick={handlePasswords}
            className="inline-block bg-blue-500 text-white rounded-lg px-6 py-3 sm:px-8 sm:py-4 hover:bg-blue-600 transition-all text-sm sm:text-base font-medium"
          >
            Add Password
          </Link>
        </div>
      </div>

      {/* Passwords Display Section - Fully Responsive */}
      <div className="passwords text-white px-4 sm:px-6 lg:px-8 pb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 font-display">Passwords</h1>
        
        {passkeyArray.length === 0 && (
          <div className="text-center text-gray-300 text-base sm:text-lg">No passwords to show</div>
        )}

        {passkeyArray.length !== 0 && (
          <div className="w-full max-w-7xl mx-auto">
            {/* Desktop/Tablet Table View (hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full rounded-xl bg-gradient-to-b from-[#291461cc] via-[#140934cc] to-transparent backdrop-blur-sm text-white">
                <thead className="bg-gradient-to-b from-[#3b1a8a] to-[#291461]">
                  <tr>
                    <th className="py-3 px-4 lg:py-4 lg:px-6 text-left text-sm sm:text-base">Site</th>
                    <th className="py-3 px-4 lg:py-4 lg:px-6 text-left text-sm sm:text-base">Username</th>
                    <th className="py-3 px-4 lg:py-4 lg:px-6 text-left text-sm sm:text-base">Password</th>
                    <th className="py-3 px-4 lg:py-4 lg:px-6 text-center text-sm sm:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passkeyArray.map((item, index) => (
                    <tr key={index} className="border-b border-gray-600/30 hover:bg-white/5 transition-colors">
                      {/* Site Column */}
                      <td className="py-3 px-4 lg:py-4 lg:px-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <a 
                            href={item.site} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-300 hover:text-blue-100 truncate max-w-[120px] sm:max-w-[200px] text-sm sm:text-base"
                          >
                            {item.site}
                          </a>
                          <svg 
                            onClick={() => copyText(item.site)} 
                            className="cursor-pointer hover:text-blue-300 flex-shrink-0 w-4 h-4" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="currentColor" 
                            viewBox="0 0 16 16"
                          >
                            <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                          </svg>
                        </div>
                      </td>
                      
                      {/* Username Column */}
                      <td className="py-3 px-4 lg:py-4 lg:px-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="truncate max-w-[100px] sm:max-w-[150px] text-sm sm:text-base" >{item.username}</span>
                          <svg 
                            onClick={() => copyText(item.username)} 
                            className="cursor-pointer hover:text-blue-300 flex-shrink-0 w-4 h-4" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="currentColor" 
                            viewBox="0 0 16 16"
                          >
                            <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                          </svg>
                        </div>
                      </td>
                      
                      {/* Password Column */}
                      <td className="py-3 px-4 lg:py-4 lg:px-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="font-mono text-sm sm:text-base">{'•'.repeat(8)}</span>
                          <svg 
                            onClick={() => copyText(item.password)} 
                            className="cursor-pointer hover:text-blue-300 flex-shrink-0 w-4 h-4" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="currentColor" 
                            viewBox="0 0 16 16"
                          >
                            <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                          </svg>
                        </div>
                      </td>
                      
                      {/* Actions Column */}
                      <td className="py-3 px-4 lg:py-4 lg:px-6">
                        <div className="flex justify-center gap-3 sm:gap-4">
                          {/* Edit Button */}
                          <svg 
                            onClick={() => editPassword(item.id)} 
                            className="cursor-pointer hover:text-blue-300 w-4 h-4 sm:w-5 sm:h-5" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 494.936 494.936" 
                            fill="currentColor"
                          >
                            <path d="M389.844,182.85c-6.743,0-12.21,5.467-12.21,12.21v222.968c0,23.562-19.174,42.735-42.736,42.735H67.157c-23.562,0-42.736-19.174-42.736-42.735V150.285c0-23.562,19.174-42.735,42.736-42.735h267.741c6.743,0,12.21-5.467,12.21-12.21s-5.467-12.21-12.21-12.21H67.157C30.126,83.13,0,113.255,0,150.285v267.743c0,37.029,30.126,67.155,67.157,67.155h267.741c37.03,0,67.156-30.126,67.156-67.155V195.061C402.054,188.318,396.587,182.85,389.844,182.85z"/>
                            <path d="M483.876,20.791c-14.72-14.72-38.669-14.714-53.377,0L221.352,229.944c-0.28,0.28-3.434,3.559-4.251,5.396l-28.963,65.069c-2.057,4.619-1.056,10.027,2.521,13.6c2.337,2.336,5.461,3.576,8.639,3.576c1.675,0,3.362-0.346,4.96-1.057l65.07-28.963c1.83-0.815,5.114-3.97,5.396-4.25L483.876,74.169c7.131-7.131,11.06-16.61,11.06-26.692C494.936,37.396,491.007,27.915,483.876,20.791z"/>
                          </svg>
                          
                          {/* Delete Button */}
                          <svg 
                            onClick={() => deletePassword(item.id)} 
                            className="cursor-pointer hover:text-red-400 w-4 h-4 sm:w-5 sm:h-5" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <path d="M10 12V17" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 12V17" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 7H20" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (visible only on mobile) */}
            <div className="md:hidden space-y-4">
              {passkeyArray.map((item, index) => (
                <div key={index} className="bg-gradient-to-b from-[#291461cc] via-[#140934cc] to-transparent backdrop-blur-sm rounded-xl p-4 border border-gray-600/20">
                  <div className="space-y-4">
                    {/* Site Row */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1 uppercase tracking-wide">Site</label>
                      <div className="flex items-center justify-between gap-3">
                        <a 
                          href={item.site} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-300 hover:text-blue-100 truncate flex-1 text-sm"
                        >
                          {item.site}
                        </a>
                        <svg 
                          onClick={() => copyText(item.site)} 
                          className="cursor-pointer hover:text-blue-300 flex-shrink-0 w-5 h-5" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="currentColor" 
                          viewBox="0 0 16 16"
                        >
                          <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Username Row */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1 uppercase tracking-wide">Username</label>
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate flex-1 text-sm">{item.username}</span>
                        <svg 
                          onClick={() => copyText(item.username)} 
                          className="cursor-pointer hover:text-blue-300 flex-shrink-0 w-5 h-5" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="currentColor" 
                          viewBox="0 0 16 16"
                        >
                          <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Password Row */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-1 uppercase tracking-wide">Password</label>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono flex-1 text-sm">{'•'.repeat(8)}</span>
                        <svg 
                          onClick={() => copyText(item.password)} 
                          className="cursor-pointer hover:text-blue-300 flex-shrink-0 w-5 h-5" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="currentColor" 
                          viewBox="0 0 16 16"
                        >
                          <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Actions Row */}
                    <div className="flex justify-center gap-6 pt-2 border-t border-gray-600/30">
                      <button
                        onClick={() => editPassword(item.id)}
                        className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-colors text-sm"
                      >
                        <svg 
                          className="w-5 h-5" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 494.936 494.936" 
                          fill="currentColor"
                        >
                          <path d="M389.844,182.85c-6.743,0-12.21,5.467-12.21,12.21v222.968c0,23.562-19.174,42.735-42.736,42.735H67.157c-23.562,0-42.736-19.174-42.736-42.735V150.285c0-23.562,19.174-42.735,42.736-42.735h267.741c6.743,0,12.21-5.467,12.21-12.21s-5.467-12.21-12.21-12.21H67.157C30.126,83.13,0,113.255,0,150.285v267.743c0,37.029,30.126,67.155,67.157,67.155h267.741c37.03,0,67.156-30.126,67.156-67.155V195.061C402.054,188.318,396.587,182.85,389.844,182.85z"/>
                          <path d="M483.876,20.791c-14.72-14.72-38.669-14.714-53.377,0L221.352,229.944c-0.28,0.28-3.434,3.559-4.251,5.396l-28.963,65.069c-2.057,4.619-1.056,10.027,2.521,13.6c2.337,2.336,5.461,3.576,8.639,3.576c1.675,0,3.362-0.346,4.96-1.057l65.07-28.963c1.83-0.815,5.114-3.97,5.396-4.25L483.876,74.169c7.131-7.131,11.06-16.61,11.06-26.692C494.936,37.396,491.007,27.915,483.876,20.791z"/>
                        </svg>
                        Edit
                      </button>
                      
                      <button
                        onClick={() => deletePassword(item.id)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                      >
                        <svg 
                          className="w-5 h-5" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M10 12V17" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 12V17" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 7H20" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Passwords;
import eyeopen from './img/eyeopen.png'
import eyeclosed from './img/eyeclosed.png'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passkeyArray, setPasskeyArray] = useState([])

    useEffect(() => {
        let passkeys = localStorage.getItem("passwords")
        if (passkeys) {
            setPasskeyArray(JSON.parse(passkeys))
        }
    }, [])
    
    const navigate = useNavigate();

    const showPassword = () => {
        if (ref.current.src.includes(eyeclosed)) {
            ref.current.src = eyeopen
            passwordRef.current.type = "text"
        } else {
            passwordRef.current.type = "password"
            ref.current.src = eyeclosed
        }
    }

    const handlePasswords = () => {
        if (!form.site || !form.username || !form.password) {
            toast.error("Please fill out all fields");
            return;
        }

        const updatedArray = [...passkeyArray, form];
        setPasskeyArray(updatedArray);
        localStorage.setItem("passwords", JSON.stringify(updatedArray));
        toast.success("Password added successfully!");

        setTimeout(() => {
            navigate("/passwords");
        }, 1500);
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer />
            
            {/* Fully responsive container */}
            <div className="flex flex-col lg:flex-row mx-auto max-w-7xl inset-0 border border-transparent bg-gradient-to-b from-[#26135866] via-[#26135833] to-transparent rounded-md p-4 sm:p-6 lg:p-8 min-h-[500px] lg:h-[540px] gap-6 lg:gap-0">
                
                {/* Left side - Logo and description */}
                <div className="flex justify-center items-center w-full lg:w-1/2 py-8 lg:py-0">
                    <div className="flex flex-col items-center text-center max-w-md">
                        <div className="flex justify-center items-center gap-4 sm:gap-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="60"
                                width="60"
                                className="sm:h-20 sm:w-20"
                                viewBox="0 0 495 495"
                            >
                                <g>
                                    <path
                                        d="M180,107.5c0-37.22,30.28-67.5,67.5-67.5S315,70.28,315,107.5V175h40v-67.5
                C355,48.224,306.776,0,247.5,0S140,48.224,140,107.5V175h40V107.5z"
                                        fill="#9BC9FF"
                                    />
                                    <path
                                        d="M247.5,175v96.431c22.056,0,40,17.944,40,40c0,14.773-8.056,27.691-20,34.619v50.566h-20V495H425
                V175H247.5z"
                                        fill="#003F8A"
                                    />
                                    <path
                                        d="M227.5,396.616V346.05c-11.944-6.927-20-19.846-20-34.619c0-22.056,17.944-40,40-40V175H70v320
                h177.5v-98.384H227.5z"
                                        fill="#2488FF"
                                    />
                                    <path
                                        d="M207.5,311.431c0,14.773,8.056,27.692,20,34.619v50.566h40V346.05c11.944-6.927,20-19.846,20-34.619
                c0-22.056-17.944-40-40-40C225.444,271.431,207.5,289.375,207.5,311.431z"
                                        fill="#BDDBFF"
                                    />
                                </g>
                            </svg>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">&lt;PassOP/&gt;</h1>
                        </div>

                        <p className="mt-4 sm:mt-6 px-4 text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                            Secure, fast, and effortless password management — store, access, and autofill your credentials with military-grade encryption.
                        </p>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="text-black flex flex-col justify-center p-4 sm:p-6 w-full lg:w-1/2 space-y-6">
                    <div className="space-y-6">
                        <h1 className="text-white text-2xl sm:text-3xl text-center">Add Credentials</h1>
                        
                        <div className="space-y-4">
                            <input 
                                onChange={handleChange} 
                                className="bg-white opacity-30 rounded-lg hover:opacity-100 focus:opacity-100 transition-all p-3 sm:p-4 w-full text-sm sm:text-base" 
                                type="text" 
                                placeholder="Enter website URL" 
                                name='site' 
                                value={form.site} 
                            />
                            
                            <input 
                                onChange={handleChange} 
                                className="bg-white focus:opacity-100 opacity-30 rounded-lg hover:opacity-100 transition-all p-3 sm:p-4 w-full text-sm sm:text-base" 
                                type="text" 
                                placeholder="Enter username" 
                                name='username' 
                                value={form.username} 
                            />
                            
                            <div className='relative'>
                                <input 
                                    onChange={handleChange} 
                                    className="bg-white opacity-30 focus:opacity-100 hover:opacity-100 rounded-lg transition-all p-3 sm:p-4 w-full pr-12 text-sm sm:text-base" 
                                    type="password" 
                                    ref={passwordRef} 
                                    placeholder="Enter password" 
                                    name='password' 
                                    value={form.password} 
                                />
                                <img 
                                    onClick={showPassword} 
                                    ref={ref} 
                                    src={eyeclosed} 
                                    className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 cursor-pointer' 
                                    alt="Toggle Password Visibility" 
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePasswords}
                        className="bg-blue-500 mx-auto block text-white rounded-lg p-3 sm:p-4 w-full max-w-[200px] hover:bg-blue-600 transition-all text-sm sm:text-base font-medium"
                    >
                        Add Password
                    </button>
                </div>
            </div>
        </>
    )
}

export default Manager
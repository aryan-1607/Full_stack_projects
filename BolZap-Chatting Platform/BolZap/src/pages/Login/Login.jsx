import { useState } from 'react';
import { signup, login, resetPass } from '../../config/firebase';

const Login = () => {
  const [currstate, setcurrstate] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    currstate === "Sign Up"
      ? signup(userName, email, password)
      : login(email, password);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20220714/original/pngtree-emoji-of-social-media-or-chat-application-network-emoticon-background-picture-image_1607991.jpg')",
      }}
    >
      {/* Card */}
      <div className="
        flex flex-col md:flex-row
        w-full max-w-5xl
        bg-white/80 rounded-2xl shadow-2xl shadow-black
        overflow-hidden
      ">

        {/* Left Image (hidden on small screens) */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/10684215/VRG_ILLO_2411_Google_Messaging_3.gif?quality=90&strip=all&crop=0%2C0%2C100%2C100&w=1080"
            className="w-full h-full object-cover"
            alt="Messaging Simulation"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col gap-4 w-full max-w-sm"
          >
            <h1 className="font-bold text-center text-2xl sm:text-3xl">
              {currstate}
            </h1>

            {currstate === "Sign Up" && (
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="h-11 sm:h-12 p-2 rounded-xl shadow focus:bg-white"
                type="text"
                placeholder="Enter username"
              />
            )}

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 sm:h-12 p-2 rounded-xl shadow focus:bg-white"
              type="email"
              placeholder="Enter email"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 sm:h-12 p-2 rounded-xl shadow focus:bg-white"
              type="password"
              placeholder="Enter password"
            />

            <button className="
              bg-blue-700 hover:bg-blue-500
              text-white rounded-xl
              py-2 text-lg transition-colors cursor-pointer
            ">
              {currstate === "Sign Up" ? "Create Account" : "Login Now"}
            </button>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" />
              <p>Agree to terms and privacy policy</p>
            </div>

            <div className="text-sm space-y-2 text-center">
              {currstate === "Sign Up" ? (
                <p>
                  Already have an account?
                  <span
                    className="text-blue-600 font-bold cursor-pointer ml-1"
                    onClick={() => setcurrstate("Login")}
                  >
                    Login
                  </span>
                </p>
              ) : (
                <>
                  <p>
                    Create an account
                    <span
                      className="text-blue-600 font-bold cursor-pointer ml-1"
                      onClick={() => setcurrstate("Sign Up")}
                    >
                      Click here
                    </span>
                  </p>

                  <p>
                    Forgot password?
                    <span
                      className="text-blue-600 font-bold cursor-pointer ml-1"
                      onClick={() => resetPass(email)}
                    >
                      Reset
                    </span>
                  </p>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

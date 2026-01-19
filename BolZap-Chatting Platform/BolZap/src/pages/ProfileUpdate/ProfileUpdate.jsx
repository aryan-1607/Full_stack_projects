import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { upload } from "../../lib/upload";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const {setUserData} = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();

    // validation: user must have an image at least once
    if (!prevImage && !image) {
      return;
    }

    try {
      const userRef = doc(db, "users", uid);

      let avatarUrl = prevImage;

      if (image) {
        avatarUrl = await upload(image);
        setPrevImage(avatarUrl);
      }

      await setDoc(
        userRef,
        {
          name,
          bio,
          avatar: avatarUrl,
        },
        { merge: true }
      );
      const snap = await getDoc(userRef)
      setUserData(snap.data())

      navigate('/chat')
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }

      setUid(user.uid);

      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setBio(data.bio || "");
        setPrevImage(data.avatar || "");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="profile flex justify-center items-center min-h-screen bg-gradient-to-b from-sky-300 to-sky-600">
      <div className="profileContainer bg-indigo-950 flex items-center justify-between min-w-[750px] p-12 rounded-[2rem] text-white shadow-2xl">

        {/* FORM */}
        <form
          className="flex flex-col gap-6 w-1/2"
          onSubmit={profileUpdate}
        >
          <h3 className="text-3xl font-bold tracking-tight">
            Profile Details
          </h3>

          {/* Avatar */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-4 cursor-pointer group"
          >
            <input
              id="avatar"
              type="file"
              accept=".jpeg,.jpg,.png"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <img
              className="w-16 h-16 rounded-full border-2 border-blue-400 p-[2px] object-cover"
              src={
                image
                  ? URL.createObjectURL(image)
                  : prevImage || "/avatar_icon.png"
              }
              alt="Profile"
            />
            <span className="text-sm text-gray-300">
              Upload profile image
            </span>
          </label>

          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="p-3 bg-indigo-900/50 border border-indigo-800 rounded-xl text-white"
          />

          {/* Bio */}
          <textarea
            placeholder="Write profile bio"
            value={bio}
            required
            onChange={(e) => setBio(e.target.value)}
            className="p-3 bg-indigo-900/50 border border-indigo-800 rounded-xl min-h-[120px] text-white resize-none"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl cursor-pointer"
          >
            Save
          </button>
        </form>

        <hr className="w-[1px] bg-indigo-800 mx-4" />

        {/* PREVIEW */}
        <div className="flex items-center justify-center w-2/5">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : prevImage || "/bolzap-logo.svg"
            }
            alt="Preview"
            className="w-[250px] h-[250px] rounded-full"
          />
        </div>

      </div>
    </div>
  );
};

export default ProfileUpdate;

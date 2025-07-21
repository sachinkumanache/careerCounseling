import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref as dbRef, get } from "firebase/database";
import { database } from "../firebase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [profileImage, setProfileImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        const profileRef = dbRef(database, `profiles/${user.uid}`);
        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setProfileImage(data.profileImage || null);
          setIsAdmin(data.isAdmin || false); // check admin
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">CareerCounsel</h1>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>

              <Link to="/counselors" className="hover:underline">
                Find Counselors
              </Link>
              {isAdmin && (
                <>
                  <Link to="/add-counselor" className="hover:underline">
                    Add Counselor
                  </Link>
                  <Link to="/admin-counselors" className="hover:underline">
                    Admin Panel
                  </Link>
                </>
              )}

              <Link to="/profile" className="hover:underline">
                My Profile
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
              <img
                src={
                  profileImage
                    ? profileImage
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-3 pt-1 space-y-2">
          <Link
            to="/"
            className="block hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                className="block hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}

          {user && (
            <>
              {/* Profile Avatar and Label */}
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={
                    profileImage
                      ? profileImage
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                {/* <span className="text-white font-medium">My Profile</span> */}
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block hover:underline"
              >
                Dashboard
              </Link>
              <Link to="/add-counselor" className="block hover:underline">
                Add Counselor
              </Link>
              <Link to="/counselors" className="block hover:underline">
                Find Counselors
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block hover:underline"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block hover:underline"
              >
                Logout
              </button>
            </>
          )}

          {/* Close Menu Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-gray-300 hover:text-white underline mt-2"
          >
            Close Menu
          </button>
        </div>
      </div>
    </nav>
  );
}

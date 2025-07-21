import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, push } from "firebase/database";
import defaultAvatar from "../images/defaultAvatar.jpg";
import BookingModal from "../components/BookingModal";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // for redirect

const Home = () => {
  const [counselors, setCounselors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("");
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const db = getDatabase();
    const counselorRef = ref(db, "counselors");

    onValue(counselorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.values(data);
        setCounselors(loaded);
        setFiltered(loaded);
      }
    });
  }, []);

  const categories = [
    "All",
    "Career",
    "Tech Jobs",
    "Study Abroad",
    "Education",
    "Mental Health",
    "Finance",
    "Relationships",
    "Life Coaching",
    "Communication Skills",
  ];

  const handleFilter = (cat) => {
    setCategory(cat);
    if (cat === "All") setFiltered(counselors);
    else setFiltered(counselors.filter((c) => c.category === cat));
  };
  const handleBookSession = async (bookingData) => {
    try {
      const db = getDatabase();
      const auth = getAuth();
      const user = auth.currentUser;

      const dataToSave = {
        ...bookingData,
        bookedBy: user ? user.uid : "anonymous",
        createdAt: new Date().toISOString(),
      };

      await push(ref(db, "bookings"), dataToSave);
      alert("✅ Session booked successfully!");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("❌ Failed to book session. Try again.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-50 to-teal-100 py-12 px-6 text-center rounded-lg shadow-md mb-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          Find the Right Support, Anytime.
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Whether you're navigating your career, studying abroad, managing
          stress, or improving your life skills — we connect you with
          experienced counselors to guide you every step of the way.
        </p>
      </div>
      <h1 className="text-3xl font-bold text-center py-6">Our Counselors</h1>

      <div className="flex flex-wrap justify-center gap-3 mb-6 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 border rounded-full ${
              category === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            } hover:bg-blue-100 transition`}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 pb-10">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            <img
              src={c.image || defaultAvatar}
              alt={c.name}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="text-sm text-gray-600">{c.specialization}</p>
            <p className="text-xs text-gray-500">{c.category}</p>
            <p className="text-sm mt-2">{c.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              Available: {c.availableDays.join(", ")}
            </p>
            <button
              onClick={() => {
                const user = auth.currentUser;
                if (!user) {
                  navigate("/login"); // or "/log" if that's your login route
                } else {
                  setSelectedCounselor(c);
                }
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Book
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white py-12 px-6 mt-12 shadow-inner rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-8">
          What Our Users Are Saying
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              “I was so lost in my career, but after one session with Aditi
              Mehta, I had complete clarity on my next steps. Thank you for this
              amazing platform!”
            </p>
            <div className="flex items-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold text-gray-800">Ravi Sharma</h4>
                <span className="text-sm text-gray-500">
                  Marketing Graduate
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              “The tech job counseling sessions helped me crack my first
              frontend role. Very practical advice and real encouragement.”
            </p>
            <div className="flex items-center">
              <img
                src="https://randomuser.me/api/portraits/women/45.jpg"
                alt="User"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold text-gray-800">Sneha Verma</h4>
                <span className="text-sm text-gray-500">
                  Frontend Developer
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              “Thanks to the study abroad mentor, I’m now pursuing my dream
              degree in Canada. The process felt so much easier with their
              help.”
            </p>
            <div className="flex items-center">
              <img
                src="https://randomuser.me/api/portraits/men/29.jpg"
                alt="User"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold text-gray-800">Ankur Singh</h4>
                <span className="text-sm text-gray-500">
                  International Student
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 text-center">
        © 2025 CounselConnect. All Rights Reserved.
      </footer>

      {selectedCounselor && (
        <BookingModal
          counselor={selectedCounselor}
          onClose={() => setSelectedCounselor(null)}
          onBook={handleBookSession}
        />
      )}
    </div>
  );
};

export default Home;

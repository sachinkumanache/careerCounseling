import { useEffect, useState } from "react";
import { ref as dbRef, get } from "firebase/database";
import { database } from "../firebase";

export default function CounselorList() {
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);

  useEffect(() => {
    const fetchCounselors = async () => {
      const counselorsRef = dbRef(database, "counselors");
      const snapshot = await get(counselorsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const formatted = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setCounselors(formatted);
      }
    };

    fetchCounselors();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 mt-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        👨‍🏫 Available Counselors
      </h2>

      {counselors.length === 0 ? (
        <p className="text-center text-gray-500">No counselors available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {counselors.map((counselor) => (
            <div
              key={counselor.id}
              className="bg-white shadow-md rounded-lg p-4 text-center"
            >
              <img
                src={
                  counselor.image ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={counselor.name}
                className="w-20 h-20 rounded-full mx-auto object-cover mb-3"
              />
              <h3 className="text-lg font-semibold">{counselor.name}</h3>
              <p className="text-sm text-blue-600 font-medium">
                {counselor.specialization}
              </p>
              <p className="text-sm text-gray-600 mt-2">{counselor.bio}</p>
              <button
                onClick={() => setSelectedCounselor(counselor)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Book Session
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Optional Modal */}
      {selectedCounselor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">
              Book a session with {selectedCounselor.name}
            </h3>
            <p className="mb-4">Booking feature coming soon!</p>
            <button
              onClick={() => setSelectedCounselor(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

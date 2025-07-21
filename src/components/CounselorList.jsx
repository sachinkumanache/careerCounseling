import { useState } from "react";
import BookingModal from "../components/BookingModal";

export default function CounselorList({ counselors }) {
  const [selectedCounselor, setSelectedCounselor] = useState(null);

  const handleBooking = (data) => {
    console.log("Booking Data Submitted:", data);
    // You can now push this data to Firebase Realtime DB under a 'bookings' node
  };

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {counselors.map((counselor) => (
        <div
          key={counselor.id}
          className="bg-white rounded shadow p-4 text-center"
        >
          <img
            src={
              counselor.image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={counselor.name}
            className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
          />
          <h3 className="text-lg font-bold">{counselor.name}</h3>
          <p className="text-sm text-gray-600">{counselor.specialization}</p>
          <button
            onClick={() => setSelectedCounselor(counselor)}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Book
          </button>
        </div>
      ))}

      {selectedCounselor && (
        <BookingModal
          counselor={selectedCounselor}
          onClose={() => setSelectedCounselor(null)}
          onBook={handleBooking}
        />
      )}
    </div>
  );
}

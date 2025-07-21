import React from "react";
import { getAuth } from "firebase/auth";

export default function BookingModal({ counselor, onClose, onBook }) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          Book Session with {counselor.name}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = {
              name: e.target.name.value,
              email: currentUser?.email || "anonymous", // Get email from logged-in user
              date: e.target.date.value,
              time: e.target.time.value,
              counselorId: counselor.id,
            };
            onBook(data);
            onClose();
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full mb-3 p-2 border rounded"
            required
          />
          {/* ✅ Email field removed */}

          <input
            type="date"
            name="date"
            className="w-full mb-3 p-2 border rounded"
            required
          />
          <input
            type="time"
            name="time"
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

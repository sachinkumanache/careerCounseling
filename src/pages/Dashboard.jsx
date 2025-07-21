import { useEffect, useState } from "react";
import { ref as dbRef, get, update } from "firebase/database";
import { auth, database } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import dayjs from "dayjs";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [counselorsMap, setCounselorsMap] = useState({});
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const profileSnap = await get(dbRef(database, `profiles/${user.uid}`));
        if (profileSnap.exists()) {
          const data = profileSnap.val();
          setProfile(data);
          setName(data.name || "");
          setSkills((data.skills || []).join(", "));
          setBio(data.bio || "");
        }

        const bookingsSnap = await get(dbRef(database, `bookings`));
        const bookingsData = bookingsSnap.val() || {};
        const userBookings = Object.values(bookingsData).filter(
          (b) => b.bookedBy === user.uid
        );
        setBookings(userBookings);

        const counselorSnap = await get(dbRef(database, `counselors`));
        const counselorData = counselorSnap.val() || {};
        const map = {};
        Object.keys(counselorData).forEach((id) => {
          map[id] = {
            name: counselorData[id].name,
            image: counselorData[id].profileImage || null,
          };
        });
        setCounselorsMap(map);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const uploadToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=cc50443f8a31e0f61f8013b66768687a`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data?.data?.url;
  };

  const handleUpdate = async () => {
    const updates = {
      name,
      skills: skills.split(",").map((s) => s.trim()),
      bio,
    };

    if (imageUpload) {
      try {
        const imageUrl = await uploadToImgBB(imageUpload);
        updates.profileImage = imageUrl;
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image. Please try again.");
      }
    }

    await update(dbRef(database, `profiles/${user.uid}`), updates);
    alert("Profile updated!");

    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));

    setEditMode(false);
  };

  const getTimeRemaining = (dateStr, timeStr) => {
    const now = dayjs();
    const [hours, minutes] = timeStr.split(":").map(Number);
    const meetTime = dayjs(dateStr).hour(hours).minute(minutes);
    const diff = meetTime.diff(now, "minute");

    if (diff <= 0) return "Session time has passed.";
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return `⏳ Time left: ${hrs}h ${mins}m`;
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!profile) return <div className="p-4">No profile found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        👋 Welcome, {profile.name}
      </h2>

      <div className="flex justify-center mb-4">
        <img
          src={
            profile.profileImage ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {editMode && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Upload New Profile Picture:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageUpload(e.target.files[0])}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="block font-semibold">Name:</label>
        {editMode ? (
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <p>{profile.name}</p>
        )}

        <label className="block font-semibold">Skills:</label>
        {editMode ? (
          <input
            className="border p-2 w-full"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        ) : (
          <p>{profile.skills?.join(", ")}</p>
        )}

        <label className="block font-semibold">Bio:</label>
        {editMode ? (
          <textarea
            className="border p-2 w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        ) : (
          <p>{profile.bio}</p>
        )}
      </div>

      <div className="mt-4 space-x-4">
        {editMode ? (
          <>
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Bookings Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">📅 Your Bookings:</h3>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul className="space-y-3">
            {bookings.map((booking, i) => {
              const counselor = counselorsMap[booking.counselorId];
              return (
                <li
                  key={i}
                  className="border rounded p-3 shadow-sm bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        counselor?.image ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="Counselor"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p>
                        <strong>Date:</strong> {booking.date} at {booking.time}
                      </p>
                      <p>
                        <strong>With:</strong>{" "}
                        {counselor?.name || "Unknown Counselor"}
                      </p>
                      <p>
                        <strong>Email:</strong> {booking.email}
                      </p>
                      <p>
                        <strong>Name:</strong> {booking.name}
                      </p>
                      {dayjs().isSame(dayjs(booking.date), "day") && (
                        <p className="text-blue-600 font-semibold mt-1">
                          {getTimeRemaining(booking.date, booking.time)}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

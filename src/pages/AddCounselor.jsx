import { useState } from "react";
import { ref as dbRef, push } from "firebase/database";
import { database } from "../firebase";

export default function AddCounselor() {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !specialization || !bio || !image) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await uploadToImgBB(image);

      const newCounselor = {
        name,
        specialization,
        bio,
        image: imageUrl,
      };

      await push(dbRef(database, "counselors"), newCounselor);
      alert("Counselor added!");
      setName("");
      setSpecialization("");
      setBio("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow mt-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Counselor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Specialization"
          className="w-full border p-2 rounded"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
        <textarea
          placeholder="Short Bio"
          className="w-full border p-2 rounded"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Add Counselor"}
        </button>
      </form>
    </div>
  );
}

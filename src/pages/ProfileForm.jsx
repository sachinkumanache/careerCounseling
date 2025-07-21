import { useState } from "react";
import { auth, database } from "../firebase";
import { ref, set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function ProfileForm() {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [role, setRole] = useState("seeker");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit a profile.");
      return;
    }

    try {
      const profileRef = ref(database, `profiles/${user.uid}`);
      await set(profileRef, {
        uid: user.uid,
        email: user.email,
        name,
        role,
        skills: skills.split(",").map((s) => s.trim()),
        bio,
        createdAt: new Date().toISOString(),
      });

      alert("Profile saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error saving profile: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          className="border p-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="seeker">Career Seeker</option>
          <option value="counselor">Career Counselor</option>
        </select>

        <input
          className="border p-2 w-full"
          placeholder="Skills or Expertise (comma-separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Short Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 w-full"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

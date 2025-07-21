import { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref as dbRef, get, push, remove, update } from "firebase/database";

const categories = [
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

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AdminCounselorPanel() {
  const [counselors, setCounselors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    category: "Career",
    description: "",
    email: "",
    availableDays: [],
    imageFile: null,
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const loadCounselors = async () => {
    const snapshot = await get(dbRef(database, "counselors"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setCounselors(list);
    }
  };

  useEffect(() => {
    loadCounselors();
  }, []);

  const uploadImageToImgbb = async (imageFile) => {
    const form = new FormData();
    form.append("image", imageFile);
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=cc50443f8a31e0f61f8013b66768687a`,
      {
        method: "POST",
        body: form,
      }
    );
    const data = await response.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = formData.imageFile
        ? await uploadImageToImgbb(formData.imageFile)
        : formData.image || "https://via.placeholder.com/150";

      const updatedCounselor = {
        name: formData.name,
        specialization: formData.specialization,
        category: formData.category,
        description: formData.description,
        email: formData.email,
        availableDays: formData.availableDays,
        image: imageUrl,
      };

      if (editingId) {
        await update(
          dbRef(database, `counselors/${editingId}`),
          updatedCounselor
        );
        alert("Counselor updated successfully!");
      } else {
        await push(dbRef(database, "counselors"), updatedCounselor);
        alert("Counselor added successfully!");
      }

      setFormData({
        name: "",
        specialization: "",
        category: "Career",
        description: "",
        email: "",
        availableDays: [],
        imageFile: null,
        image: "",
      });
      setEditingId(null);
      await loadCounselors();
    } catch (error) {
      alert("Error while submitting counselor");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this counselor?")) {
      await remove(dbRef(database, `counselors/${id}`));
      loadCounselors();
    }
  };

  const handleEdit = (counselor) => {
    setEditingId(counselor.id);
    setFormData({
      name: counselor.name,
      specialization: counselor.specialization,
      category: counselor.category,
      description: counselor.description,
      email: counselor.email,
      availableDays: counselor.availableDays || [],
      imageFile: null,
      image: counselor.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Admin: {editingId ? "Edit" : "Add"} Counselor
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow p-4 rounded"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={(e) =>
            setFormData({ ...formData, specialization: e.target.value })
          }
          required
          className="border p-2 w-full"
        />
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="border p-2 w-full"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          className="border p-2 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <div>
          <p className="font-medium mb-1">Available Days:</p>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((day) => (
              <label key={day} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.availableDays.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, imageFile: e.target.files[0] })
          }
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Counselor"
            : "Add Counselor"}
        </button>
      </form>

      <h3 className="text-xl font-bold mt-8 mb-4">Counselor List</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {counselors.map((c) => (
          <div key={c.id} className="bg-white border shadow p-4 rounded">
            <img
              src={c.image || "https://via.placeholder.com/100"}
              alt={c.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h4 className="font-bold text-lg">{c.name}</h4>
            <p className="text-sm text-blue-600">{c.specialization}</p>
            <p className="text-sm text-gray-700">{c.description}</p>
            <p className="text-xs mt-1">📧 {c.email}</p>
            <p className="text-xs">📆 {c.availableDays?.join(", ")}</p>
            <p className="text-xs">🏷️ Category: {c.category}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(c)}
                className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// import { ref, set } from "firebase/database";

// const counselors = [
//   {
//     id: "c1",
//     name: "Aditi Mehta",
//     specialization: "Career Counseling",
//     category: "Career",
//     description:
//       "Helps students and job seekers discover the right career paths based on their interests.",
//     email: "aditi.career@example.com",
//     image: "https://randomuser.me/api/portraits/women/65.jpg",
//     availableDays: ["Mon", "Wed", "Fri"],
//   },
//   {
//     id: "c2",
//     name: "Rahul Singh",
//     specialization: "Tech Career Coach",
//     category: "Tech Jobs",
//     description:
//       "Guides professionals looking to switch or grow in tech roles.",
//     email: "rahul.tech@example.com",
//     image: "https://randomuser.me/api/portraits/men/32.jpg",
//     availableDays: ["Tue", "Thu"],
//   },
//   {
//     id: "c3",
//     name: "Priya Patel",
//     specialization: "Study Abroad Consultant",
//     category: "Study Abroad",
//     description:
//       "Supports students in planning and applying for overseas education.",
//     email: "priya.abroad@example.com",
//     image: "https://randomuser.me/api/portraits/women/51.jpg",
//     availableDays: ["Mon", "Tue", "Fri"],
//   },
//   {
//     id: "c4",
//     name: "Ankit Sharma",
//     specialization: "Educational Psychologist",
//     category: "Education",
//     description:
//       "Helps students with learning strategies and academic success.",
//     email: "ankit.edu@example.com",
//     image: "https://randomuser.me/api/portraits/men/72.jpg",
//     availableDays: ["Wed", "Thu"],
//   },
//   {
//     id: "c5",
//     name: "Megha Das",
//     specialization: "Therapist",
//     category: "Mental Health",
//     description:
//       "Provides mental health support for stress, anxiety, and depression.",
//     email: "megha.mental@example.com",
//     image: "https://randomuser.me/api/portraits/women/23.jpg",
//     availableDays: ["Mon", "Thu", "Sat"],
//   },
//   {
//     id: "c6",
//     name: "Sanjay Verma",
//     specialization: "Financial Advisor",
//     category: "Finance",
//     description:
//       "Advises on budgeting, saving, investing, and financial planning.",
//     email: "sanjay.finance@example.com",
//     image: "https://randomuser.me/api/portraits/men/61.jpg",
//     availableDays: ["Tue", "Fri"],
//   },
//   {
//     id: "c7",
//     name: "Neha Kapoor",
//     specialization: "Relationship Coach",
//     category: "Relationships",
//     description: "Helps individuals and couples build healthy relationships.",
//     email: "neha.relationships@example.com",
//     image: "https://randomuser.me/api/portraits/women/38.jpg",
//     availableDays: ["Wed", "Sat"],
//   },
//   {
//     id: "c8",
//     name: "Arjun Rao",
//     specialization: "Life Coach",
//     category: "Life Coaching",
//     description: "Guides people to reach personal and professional goals.",
//     email: "arjun.life@example.com",
//     image: "https://randomuser.me/api/portraits/men/47.jpg",
//     availableDays: ["Mon", "Thu"],
//   },
//   {
//     id: "c9",
//     name: "Ishita Jain",
//     specialization: "Communication Trainer",
//     category: "Communication Skills",
//     description:
//       "Trains students and professionals to improve verbal & non-verbal communication.",
//     email: "ishita.comm@example.com",
//     image: "https://randomuser.me/api/portraits/women/44.jpg",
//     availableDays: ["Tue", "Fri"],
//   },
//   {
//     id: "c10",
//     name: "Vikram Desai",
//     specialization: "Public Speaking Coach",
//     category: "Communication Skills",
//     description:
//       "Helps people boost confidence in presentations and public speaking.",
//     email: "vikram.speak@example.com",
//     image: "https://randomuser.me/api/portraits/men/36.jpg",
//     availableDays: ["Wed", "Sat"],
//   },
// ];

// export const uploadCounselorsToFirebase = async () => {
//   try {
//     const counselorsRef = ref(database, "counselors");

//     const dataObject = {};
//     counselors.forEach((counselor) => {
//       dataObject[counselor.id] = counselor;
//     });

//     await set(counselorsRef, dataObject);
//     alert("Counselors uploaded successfully!");
//   } catch (error) {
//     console.error("Error uploading counselors:", error);
//     alert("Failed to upload counselor data.");
//   }
// };

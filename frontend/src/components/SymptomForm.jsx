import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export default function SymptomForm() {
  const [title, setTitle] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    axiosInstance.get("/symptoms/").then((res) => setEntries(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/symptoms/", { title });
    const res = await axiosInstance.get("/symptoms/");
    setEntries(res.data);
    setTitle("");
  };

  return (
    <div className="card">
      <h2>Log Symptom</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Symptom..."
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {entries.map((e) => (
          <li key={e.id}>{e.title}</li>
        ))}
      </ul>
    </div>
  );
}

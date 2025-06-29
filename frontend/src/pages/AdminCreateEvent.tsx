import { useState } from "react";
import type { Event } from "../types/Event";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { EventService } from "../services/EventServices";

export default function AdminCreateEvent() {
  const [form, setForm] = useState<Event>({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await EventService.createEvent(form);
      alert("Event created!");
      navigate("/");
    } catch {
      alert("Error creating event");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      <input className="input" name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <textarea className="input mt-2" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input className="input mt-2" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input className="input mt-2" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      <input className="input mt-2" name="date" type="date" value={form.date} onChange={handleChange} />
      <button className="btn mt-4" onClick={handleSubmit}>Create</button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { EventService } from "../services/EventServices";
import type { Event } from "../types/Event";

const initialFormState: Event = {
  title: "",
  description: "",
  category: "",
  location: "",
  date: "",
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<Event>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await EventService.getEvents();
    setEvents(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await EventService.updateEvent({ ...formData, id: editingId });
      setEditingId(null);
    } else {
      await EventService.createEvent(formData);
    }
    setFormData(initialFormState);
    loadEvents();
  };

  const handleEdit = (event: Event) => {
    setFormData(event);
    setEditingId(event.id ?? null);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await EventService.deleteEvent(id);
      loadEvents();
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Event Central</h1>

      <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">
          {editingId ? "Edit Event" : "Add Event"}
        </h2>
        <input
          className="w-full p-2 mb-2 border rounded"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          className="w-full p-2 mb-2 border rounded"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          className="w-full p-2 mb-2 border rounded"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <input
          className="w-full p-2 mb-2 border rounded"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <input
          className="w-full p-2 mb-2 border rounded"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="border p-4 rounded shadow flex justify-between items-start"
          >
            <div>
              <h2 className="text-xl font-semibold">{ev.title}</h2>
              <p>{ev.description}</p>
              <p className="text-sm text-gray-600">
                📍 {ev.location} | 📅 {new Date(ev.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => handleEdit(ev)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(ev.id!)}
                className="text-red-600 hover:underline"
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

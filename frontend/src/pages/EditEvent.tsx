import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { EventService } from "../services/EventServices";
import type { Event } from "../types/Event";
import toast from "react-hot-toast";
import { eventCategories } from "./AdminCreateEvent";
import { formatDateForInput } from "../utilities/CommonUtility";

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  date?: string;
}

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event>({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    creatorName: "",
    creatorEmail:""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const eventData = await EventService.getEvent(Number(id));
        const formattedEvent = {
          ...eventData,
          date: formatDateForInput(eventData.date)
        };
        setEvent(formattedEvent);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        toast.error("Failed to load event");
        navigate("/admin/events");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!event.title.trim()) {
      newErrors.title = "Event title is required";
    } else if (event.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    } else if (event.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!event.description.trim()) {
      newErrors.description = "Event description is required";
    } else if (event.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    } else if (event.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    if (!event.category) {
      newErrors.category = "Please select a category";
    }

    if (!event.location.trim()) {
      newErrors.location = "Event location is required";
    } else if (event.location.length < 3) {
      newErrors.location = "Location must be at least 3 characters long";
    }

    if (!event.date) {
      newErrors.date = "Event date is required";
    } else {
      const selectedDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Event date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
    setIsDirty(true);

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before updating");
      return;
    }

    setIsUpdating(true);
    try {
      await EventService.updateEvent({ ...event, id: Number(id) });
      toast.success("Event updated successfully!");
      navigate("/admin/events");
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/admin/events");
      }
    } else {
      navigate("/admin/events");
    }
  };

  const inputClasses = (fieldName: keyof FormErrors) => 
    `w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      errors[fieldName] 
        ? 'border-red-300 bg-red-50 focus:ring-red-500' 
        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
    }`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <button 
              onClick={() => navigate('/admin/events')}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Events
            </button>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <span>Edit Event</span>
          </div>
          
          {/* User context */}
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xs">
                {user?.fullName?.split(' ').map(n => n[0]).join('') || 'A'}
              </span>
            </div>
            <span className="text-xs">Editing as {user?.fullName || 'Admin'}</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Event</h1>
          <p className="text-gray-600 text-sm">
            Update the event details below to modify the existing event.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
          {/* Event Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter a compelling event title..."
              value={event.title}
              onChange={handleChange}
              className={inputClasses('title')}
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {errors.title}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {event.title.length}/100 characters
            </p>
          </div>

          {/* Event Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Event Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Provide a detailed description of your event..."
              value={event.description}
              onChange={handleChange}
              className={`${inputClasses('description')} resize-none`}
              maxLength={1000}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {event.description.length}/1000 characters
            </p>
          </div>

          {/* Category and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={event.category}
                onChange={handleChange}
                className={inputClasses('category')}
              >
                <option value="">Select a category...</option>
                {eventCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Event venue or online link..."
                value={event.location}
                onChange={handleChange}
                className={inputClasses('location')}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Event Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Event Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={event.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={inputClasses('date')}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {errors.date}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Update Event
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            Editing Tips
          </h3>
          <ul className="text-blue-800 space-y-1 text-xs">
            <li>• Make sure the event date is not in the past</li>
            <li>• Update the description to reflect any changes in agenda or speakers</li>
            <li>• Double-check location details, especially for virtual events</li>
            <li>• Changes will be visible to all event attendees</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
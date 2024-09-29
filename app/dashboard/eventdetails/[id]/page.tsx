"use client";
import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  PencilIcon,
  Trash2Icon,
  ArrowLeftIcon,
} from "lucide-react";
import Cookies from "js-cookie";
import Review from "@/components/Review"; // Import the Review component

const EventDetail = () => {
  interface Event {
    _id: string;
    eventTitle: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description?: string;
    isFree: boolean;
    price?: number;
    capacity: number;
  }

  const [event, setEvent] = useState<Event | null>(null); // State to hold event data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // For delete confirmation modal
  const router = useRouter();

  const params = useParams(); // Extract the eventId from the URL
  const pathname = usePathname();
  const eventId = params?.id || pathname.split("/").pop(); // Get eventId from URL

  // Fetch event data when component mounts
  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const token = Cookies.get("token"); // Get token from cookies

        const response = await fetch(`/api/eventdetail/${eventId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        setEvent(data.event); // Set event data
      } catch (err) {
        setError((err as Error).message || "An error occurred while fetching event data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleEdit = () => {
    router.push(`/dashboard/events/editevent/${eventId}`);
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`/api/deleteevent/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Redirect to events list after successful deletion
      router.push("/dashboard/events");
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError("An error occurred while deleting the event.");
    }
  };

  const handleBack = () => {
    router.push("/dashboard/events");
  };

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Sidebar />
      {/* Event Details */}
      <div className="max-w-4xl mx-auto p-8 mt-16 space-y-6 bg-white shadow-lg rounded-lg relative">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        {/* Edit Button */}
        <button
          onClick={handleEdit}
          className="absolute top-4 right-14 text-gray-500 hover:text-gray-700"
        >
          <PencilIcon className="w-6 h-6" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
        >
          <Trash2Icon className="w-6 h-6" />
        </button>

        {event && (
          <>
            {/* Event Title */}
            <h1 className="text-4xl font-bold text-gray-900">{event.eventTitle}</h1>

            {/* Date, Time, and Location */}
            <div className="flex space-x-8 mt-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="text-gray-500" />
                <span className="text-lg text-gray-700">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="text-gray-500" />
                <span className="text-lg text-gray-700">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="text-gray-500" />
                <span className="text-lg text-gray-700">{event.location}</span>
              </div>
            </div>

            {/* Event Description */}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800">Event Description</h2>
              <p className="text-lg text-gray-600 mt-2">
                {event.description || "No description provided."}
              </p>
            </div>

            {/* Ticket Info */}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800">Ticket Information</h2>
              <div className="flex space-x-8 mt-4">
                <div className="flex items-center space-x-2">
                  <TicketIcon className="text-gray-500" />
                  <span className="text-lg text-gray-700">
                    Price: {event.isFree ? "Free" : `$${event.price}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg text-gray-700">Capacity: {event.capacity}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Review Section */}
        {event?._id && (
          <div className="mt-8">
            <Review eventId={event._id} /> {/* Pass eventId to Review component */}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-4">Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;

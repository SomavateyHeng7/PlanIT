"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { PlusIcon } from "lucide-react";
import Cookies from "js-cookie";  // Import js-cookie

export default function EventList() {
  interface Event {
    _id: string;
    eventTitle: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    isFree: boolean;
    price: number;
    capacity: number;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = Cookies.get("token");  // Retrieve token from cookies
        if (!token) {
          throw new Error("User is not authenticated");
        }

        const response = await fetch("/api/ownevent", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,  // Use token from cookies
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data.events || []);  // Ensure it sets an empty array if no events are found
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div>
      <Sidebar />
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">My Events</h1>
          <Link href="/dashboard/events/createevent">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Event
            </button>
          </Link>
        </div>

        {/* Error or No Events UI */}
        {error ? (
          <div className="text-gray-500 text-lg justify-center flex">No event found</div>
        ) : events.length === 0 ? (
          <div className="text-gray-500 text-lg">No events found. Click the button above to create one.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {events.map((event) => (
              <Link
                key={event._id}
                href={`/dashboard/eventdetails/${event._id}`}
                className="bg-white shadow-lg p-6 rounded-lg block hover:bg-gray-100"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {event.eventTitle}
                </h2>
                <p className="text-gray-500 mb-4">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-500 mb-4">
                  Time: {event.startTime} - {event.endTime}
                </p>
                <p className="text-gray-500 mb-4">Location: {event.location}</p>
                <p className="text-gray-500 mb-4">
                  Price: {event.isFree ? "Free" : `$${event.price}`}
                </p>
                <p className="text-gray-500 mb-4">
                  Capacity: {event.capacity}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}

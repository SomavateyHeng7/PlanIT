"use client";

import Navbar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function HomePage() {
  interface Event {
    _id: string;
    eventTitle: string;
    date: string;
    description: string;
    image?: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events from API when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/allevent", {
          method: "GET",
          headers: {
            'Cache-Control': 'no-store',  // Add Cache-Control to disable caching
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);  // Fetch only once on component mount
  

  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to the Event Management Portal
        </h1>
        <p className="text-lg text-center mb-8">
          Discover and Join Exciting Events!
        </p>

        {loading ? (
          <p className="text-center">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {events.map((event) => (
              <Link
                key={event._id}
                href={`/eventdetails/${event._id}`}
                className="bg-white shadow-lg p-6 rounded-lg block hover:bg-gray-100"
              >
                {/* Uncomment the image section if you have images for the events */}
                {/* <div className="relative h-48 w-full mb-4">
                  <Image
                    src={event.image || "/images/logo.png"}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div> */}
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {event.eventTitle}
                </h2>
                <p className="text-gray-500 mb-4">Date: {event.date}</p>
                <p className="text-gray-700 mb-4 truncate">
                  {event.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

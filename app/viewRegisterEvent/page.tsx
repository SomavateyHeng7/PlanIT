"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/shared/NavBar";
import { Button } from "@/components/ui/button";

// Component for displaying individual event details from tickets
const TicketEventDetails = ({ event }: { event: any }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">
        {event.eventTitle}
      </h2>
      <p className="text-gray-500">
        Date: {new Date(event.date).toLocaleDateString()} | {event.startTime} - {event.endTime}
      </p>
      <p className="text-gray-500">Location: {event.location}</p>
    </div>
  );
};

const MyTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tickets from the API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets"); // Replace with your actual tickets endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const data = await response.json();
        setTickets(data.tickets);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "An error occurred while fetching tickets.");
        } else {
          setError("An error occurred while fetching tickets.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <div>Loading your tickets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 mt-16 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Event Tickets</h1>

        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TicketEventDetails key={ticket._id} event={ticket.eventId} />
            ))
          ) : (
            <p className="text-gray-500">You haven't purchased any tickets yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;

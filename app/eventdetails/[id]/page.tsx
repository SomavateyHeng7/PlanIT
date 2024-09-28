"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, ClockIcon, MapPinIcon, TicketIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TicketPurchaseModal from '@/components/TicketDialog';
import Review from '@/components/Review'; // Import the Review component
import Navbar from '@/components/shared/NavBar';


const EventDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  interface Event {
    _id: string;
    eventTitle: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    price: string;
    capacity: string;
  }
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  
  // Open and close modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch event data dynamically based on event ID
  useEffect(() => {
    const eventId = window.location.pathname.split("/").pop();

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/eventdetail/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data.event);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred while fetching event data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      {/* Event Details */}
      <div className="max-w-4xl mx-auto p-8 mt-16 space-y-6 bg-white shadow-lg rounded-lg relative">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        {/* Event Title */}
        <h1 className="text-4xl font-bold text-gray-900">{event?.eventTitle}</h1>

        {/* Date, Time, and Location */}
        <div className="flex space-x-8 mt-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="text-gray-500" />
            <span className="text-lg text-gray-700">{event?.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="text-gray-500" />
            <span className="text-lg text-gray-700">
              {event?.startTime} - {event?.endTime}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPinIcon className="text-gray-500" />
            <span className="text-lg text-gray-700">{event?.location}</span>
          </div>
        </div>

        {/* Event Description */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800">Event Description</h2>
          <p className="text-lg text-gray-600 mt-2">{event?.description}</p>
        </div>

        {/* Ticket Info */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800">Ticket Information</h2>
          <div className="flex space-x-8 mt-4">
            <div className="flex items-center space-x-2">
              <TicketIcon className="text-gray-500" />
              <span className="text-lg text-gray-700">Price: {event?.price}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg text-gray-700">Capacity: {event?.capacity}</span>
            </div>
          </div>
        </div>

        {/* Purchase Ticket Button */}
        <div className="mt-8">
          <Button onClick={openModal} className="bg-[#2b5e9f] text-white hover:bg-[#1e4a7a]">
            Purchase Ticket
          </Button>
        </div>

        {/* Modal Dialog */}
        {event?._id && <TicketPurchaseModal isOpen={isModalOpen} onClose={closeModal} eventId={event._id} />}

        {/* Review Section */}
        {event?._id && (
          <div className="mt-8">
            <Review eventId={event._id} /> {/* Pass eventId to Review component */}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;

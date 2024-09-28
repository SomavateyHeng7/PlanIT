"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Cookies from 'js-cookie';

const EditEvent = () => {
  const router = useRouter();
  const { id } = useParams(); // Fetch the event ID from the URL params
  const token = Cookies.get('token'); // Fetch the token from cookies

  const [eventTitle, setEventTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("0.00");
  const [capacity, setCapacity] = useState("0");
  const [isFree, setIsFree] = useState(false);
  const [eventType, setEventType] = useState("Venue");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the existing event data when component mounts
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/eventdetail/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch event details");

        const data = await response.json();
        const event = data.event;
        // Set the event details in state
        setEventTitle(event.eventTitle);
        setDate(event.date.slice(0, 10)); // Format the date to YYYY-MM-DD
        setStartTime(event.startTime);
        setEndTime(event.endTime);
        setLocation(event.location || "");
        setPrice(event.price);
        setCapacity(event.capacity);
        setIsFree(event.isFree);
        setEventType(event.eventType);
      } catch (error) {
        setError("Failed to load event details");
      }
    };

    if (id) fetchEvent(); // Only fetch if event ID is available
  }, [id, token]);

  const handleToggleFree = () => setIsFree(!isFree);

  const handleSaveChanges = async () => {
    setLoading(true);
    const updatedEvent = {
      eventTitle,
      date,
      startTime,
      endTime,
      location,
      price: isFree ? 0 : price,
      capacity,
      isFree,
      eventType,
    };

    try {
      const response = await fetch(`/api/editeevent/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Event updated:', data.event);
        router.push('/dashboard/events'); // Redirect to events list after successful update
      } else {
        const errorData = await response.json();
        console.error('Error updating event:', errorData.error);
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    // Implement event deletion logic here
    console.log("Event deleted");
    router.push('/dashboard/events');
  };

  if (error) return <div>{error}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Sidebar />
      <div className="max-w-4xl mx-auto p-8 space-y-6 bg-white shadow-lg rounded-lg mt-2">
        <h1 className="text-3xl font-bold text-gray-800">Edit Event</h1>
        <p className="text-gray-600">
          Update the details of your event below.
        </p>

        {/* Event Title */}
        <div className="space-y-2">
          <label
            htmlFor="eventTitle"
            className="block text-lg font-semibold text-gray-700"
          >
            What’s the name of your event?
          </label>
          <Input
            id="eventTitle"
            placeholder="Event title *"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="date" className="block text-lg font-semibold text-gray-700">
              Date
            </label>
            <div className="relative">
              <Input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
              <CalendarIcon className="absolute right-2 top-2 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="startTime" className="block text-lg font-semibold text-gray-700">
              Start time
            </label>
            <div className="relative">
              <Input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
              />
              <ClockIcon className="absolute right-2 top-2 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="endTime" className="block text-lg font-semibold text-gray-700">
              End time
            </label>
            <div className="relative">
              <Input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full"
              />
              <ClockIcon className="absolute right-2 top-2 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Location */}
        {eventType === "Venue" && (
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-700">
              Where is it located?
            </label>
            <div className="relative mt-4">
              <Input
                placeholder="Location *"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
              <MapPinIcon className="absolute right-2 top-2 text-gray-500" />
            </div>
          </div>
        )}

        {/* Ticket Price */}
        <div className="space-y-2">
          <label htmlFor="price" className="block text-lg font-semibold text-gray-700">
            How much do you want to charge for tickets?
          </label>
          <div className="relative">
            <Input
              id="price"
              type="number"
              min="0"
              value={isFree ? "0.00" : price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isFree}
              className="w-full"
            />
            <Button
              variant="outline"
              onClick={handleToggleFree}
              className="mt-2 text-sm"
            >
              {isFree ? "Tickets are free" : "My tickets are free"}
            </Button>
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <label htmlFor="capacity" className="block text-lg font-semibold text-gray-700">
            What's the capacity for your event?
          </label>
          <Input
            id="capacity"
            type="number"
            min="0"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-between mt-4">
          <Button onClick={handleSaveChanges} className="bg-[#2b5e9f] text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;

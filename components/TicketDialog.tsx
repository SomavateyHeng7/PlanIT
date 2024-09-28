"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon, MinusIcon, PlusIcon } from "lucide-react";
import Cookies from "js-cookie";

// Define the props interface for the TicketPurchaseModal component
interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

// Modal Component for Ticket Purchase
const TicketPurchaseModal: React.FC<TicketPurchaseModalProps> = ({
  isOpen,
  onClose,
  eventId,
}) => {
  const [ticketCount, setTicketCount] = useState(1); // Initialize with at least 1 ticket
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const handleIncreaseTicket = () => setTicketCount(ticketCount + 1);
  const handleDecreaseTicket = () => {
    if (ticketCount > 1) setTicketCount(ticketCount - 1);
  };
  if (!isOpen) return null; // If modal is not open, don't render it

  // Handle purchase logic
  const handlePurchase = async () => {
    const token = Cookies.get("token"); // Retrieve token from cookies
    if (!token) {
      setError("You must be logged in to purchase tickets.");
      return;
    }

    try {
      const response = await fetch("/api/purchaseticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token as Bearer token
        },
        body: JSON.stringify({
          eventId, // Use dynamic eventId
          ticketCount,
          pricePerTicket: 20, // Set price per ticket
          cardNumber,
          expiryDate,
          cvv,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to complete the purchase.");
      }

      alert("Purchase successful!");
      onClose(); // Close the modal after successful purchase
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4" onClick={onClose}>
          <XIcon className="w-6 h-6 text-gray-500" />
        </button>

        {/* Event Information */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Ticket Purchase</h2>
          <p className="text-gray-500 mt-2">Event ID: {eventId}</p>
        </div>

        {/* Ticket Selection */}
        <div className="mb-6 border border-gray-300 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">General Admission</h3>
              <p className="text-sm text-gray-500">$20.00 - Sales end on Sep 18, 2024</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecreaseTicket}
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-100"
              >
                <MinusIcon />
              </button>
              <span>{ticketCount}</span>
              <button
                onClick={handleIncreaseTicket}
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-100"
              >
                <PlusIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Enter Card Details</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full mt-1"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full mt-1"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Checkout Button */}
        <div className="flex justify-between items-center">
          <Button onClick={handlePurchase} className="bg-[#2b5e9f] text-white px-6 py-2 rounded-lg">
            Check out
          </Button>
        </div>
      </div>
    </div>
  );
};

// Event Detail Page with Ticket Purchase Button and Modal Integration
const EventDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const router = useRouter();

  // Extract the eventId from URL params
  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    setEventId(id || null); // Update the eventId in state
  }, [router]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* Purchase Button */}
      <Button
        className="w-full bg-blue-600 text-white hover:bg-blue-500"
        onClick={openModal}
      >
        Buy Tickets
      </Button>

      {/* Modal Dialog with dynamic eventId */}
      {eventId && (
        <TicketPurchaseModal isOpen={isModalOpen} onClose={closeModal} eventId={eventId} />
      )}
    </div>
  );
};

export default TicketPurchaseModal;

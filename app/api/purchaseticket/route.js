import connectDB from '@/lib/db';  // Ensure DB is connected
import TicketPurchase from '@/models/ticket';  // Import TicketPurchase model
import Event from '@/models/event';  // Import Event model
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify the token
async function verifyToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function POST(req) {
  await connectDB();  // Ensure the database is connected

  // Verify the user's token
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventId, ticketCount, pricePerTicket, cardNumber, expiryDate, cvv } = await req.json();

    // Validate input fields
    if (!eventId || !ticketCount || !pricePerTicket || !cardNumber || !expiryDate || !cvv) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Validate ticket count (Optional: Check event capacity)
    if (event.capacity < ticketCount) {
      return NextResponse.json({ error: 'Not enough capacity for the requested tickets' }, { status: 400 });
    }

    // Create the ticket purchase
    const newTicketPurchase = new TicketPurchase({
      eventId: event._id,
      userId: user.id,
      ticketCount,
      pricePerTicket,
      totalPrice: ticketCount * pricePerTicket,
      paymentDetails: {
        cardNumber,
        expiryDate,
        cvv,
      },
    });

    // Save the ticket purchase to the database
    await newTicketPurchase.save();

    // (Optional) Update the event's remaining capacity
    event.capacity -= ticketCount;
    await event.save();

    return NextResponse.json({ message: 'Ticket purchased successfully', ticket: newTicketPurchase }, { status: 201 });
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    return NextResponse.json({ error: 'Failed to process ticket purchase' }, { status: 500 });
  }
}

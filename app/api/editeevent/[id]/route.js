import connectDB from '@/lib/db';  // Ensure DB is connected
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

export async function PUT(req, { params }) {
  await connectDB();  // Ensure the database is connected

  const { id } = params;  // Extract the event ID from the URL
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  // Verify the token before editing the event
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventTitle, date, startTime, endTime, location, price, capacity, isFree, eventType } = await req.json();

    // Find the event by ID and check if it exists
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if the logged-in user is the creator of the event
    if (event.createdBy.toString() !== user.id) {
      return NextResponse.json({ error: 'Unauthorized. You can only edit your own events.' }, { status: 403 });
    }

    // Update the event fields (Handle location based on eventType)
    event.eventTitle = eventTitle || event.eventTitle;
    event.date = date || event.date;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.price = isFree ? 0 : price || event.price;
    event.capacity = capacity || event.capacity;
    event.isFree = isFree !== undefined ? isFree : event.isFree;
    event.eventType = eventType || event.eventType;

    // Set location only if the eventType is "Venue"
    if (event.eventType === 'Venue') {
      event.location = location || event.location;
    } else {
      event.location = null;  // Set location to null for non-Venue events
    }

    // Save the updated event
    await event.save();

    return NextResponse.json({ message: 'Event updated successfully', event }, { status: 200 });
  } catch (error) {
    console.error('Error editing event:', error);
    return NextResponse.json({ error: 'Failed to edit event' }, { status: 500 });
  }
}

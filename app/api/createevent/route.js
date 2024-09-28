import connectDB from '@/lib/db';  // Ensure DB is connected
import Event from '@/models/event';  // Import Event model
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

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

  // Verify the token before creating the event
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventTitle, date, startTime, endTime, location, price, capacity, isFree, eventType } = await req.json();

    // Validate required fields
    if (!eventTitle || !date || !startTime || !endTime || !capacity) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    // Create a new event
    const newEvent = new Event({
      eventTitle,
      date,
      startTime,
      endTime,
      location: eventType === 'Venue' ? location : null,
      price: isFree ? 0 : price,
      capacity,
      isFree,
      eventType,
      createdBy: user.id,  // Associate event with the user ID from the token
    });

    // Save the event to the database
    await newEvent.save();

    return NextResponse.json({ message: 'Event created successfully', event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

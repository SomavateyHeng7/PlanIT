import connectDB from '@/lib/db';
import Review from '@/models/review';
import Event from '@/models/event';
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

  // Verify the user's token
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventId, text } = await req.json();

    // Validate input fields
    if (!eventId || !text) {
      return NextResponse.json({ error: 'Please provide eventId and review text' }, { status: 400 });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Create a new review
    const newReview = new Review({
      text,
      eventId: event._id,
      userId: user.id,  // Associate review with the logged-in user
    });

    // Save the review to the database
    await newReview.save();

    return NextResponse.json({ message: 'Review created successfully', review: newReview }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

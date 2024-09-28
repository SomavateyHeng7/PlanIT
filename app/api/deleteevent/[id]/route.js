import connectDB from '@/lib/db';  
import Event from '@/models/event';  
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

export async function DELETE(req, { params }) {
  await connectDB();  // Ensure the database is connected

  const { id } = params;  // Extract the event ID from the URL
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  // Verify the token before deleting the event
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find the event by ID
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if the logged-in user is the creator of the event
    if (event.createdBy.toString() !== user.id) {
      return NextResponse.json({ error: 'Unauthorized. You can only delete your own events.' }, { status: 403 });
    }

    // Delete the event
    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

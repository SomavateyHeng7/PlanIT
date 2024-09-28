import connectDB from '@/lib/db'; // Ensure database connection
import Event from '@/models/event'; // Import the Event model
import jwt from 'jsonwebtoken'; // For verifying the user's token
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Set JWT secret

// Middleware to verify the user's token
async function verifyToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// GET route to fetch events created by the logged-in user
export async function GET(req) {
  await connectDB(); // Ensure the database is connected

  // Verify the user's token
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find all events created by the logged-in user using the Event model
    const events = await Event.find({ createdBy: user.id });

    // If no events are found, return a 404 response
    if (!events || events.length === 0) {
      return NextResponse.json({ error: 'No events found' }, { status: 404 });
    }

    // Return the list of events created by the user
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

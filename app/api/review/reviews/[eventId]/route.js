import connectDB from '@/lib/db';
import Review from '@/models/review';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  await connectDB();  // Ensure the database is connected

  const { eventId } = params;  // Event ID from the URL
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
  }

  try {
    // Fetch all reviews for the given event
    const reviews = await Review.find({ eventId }).populate({
      path: 'userId',
      select: 'name',  // Assuming you want to display the user's name with each review
    });

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ message: 'No reviews found for this event' }, { status: 404 });
    }

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    return NextResponse.json({ error: 'Failed to retrieve reviews' }, { status: 500 });
  }
}

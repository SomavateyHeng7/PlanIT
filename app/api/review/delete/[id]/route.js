import connectDB from '@/lib/db';
import Review from '@/models/review';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function DELETE(req, { params }) {
  await connectDB();  // Ensure database connection

  const { id } = params;  // Review ID from URL

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
  }

  try {
    // Find the review by ID
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Use deleteOne to delete the review
    await Review.deleteOne({ _id: id });

    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

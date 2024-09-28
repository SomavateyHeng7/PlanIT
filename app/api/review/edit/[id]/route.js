import connectDB from '@/lib/db';
import Review from '@/models/review';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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
  await connectDB();

  const { id } = params;  // Review ID from the URL
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
  }

  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Review text is required' }, { status: 400 });
    }

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if the review belongs to the logged-in user
    if (review.userId.toString() !== user.id) {
      return NextResponse.json({ error: 'You do not have permission to edit this review' }, { status: 403 });
    }

    review.text = text;  // Update the review text
    await review.save();

    return NextResponse.json({ message: 'Review updated successfully', review }, { status: 200 });
  } catch (error) {
    console.error('Error editing review:', error);
    return NextResponse.json({ error: 'Failed to edit review' }, { status: 500 });
  }
}

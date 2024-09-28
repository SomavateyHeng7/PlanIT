import connectDB from '@/lib/db';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(req) {
  await connectDB();

  // Extract token from the Authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  // Verify token and decode the user data
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debugging token
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { newName } = await req.json();
  console.log('Request Body:', { newName }); // Debugging input data

  // Validate input
  if (!newName) {
    return NextResponse.json({ error: 'Please provide a new name' }, { status: 400 });
  }

  try {
    // Find the user by decoded ID from the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user's name only
    user.name = newName;
    await user.save();

    return NextResponse.json({ message: 'User name updated successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating user name:', error); // Debugging errors
    return NextResponse.json({ error: 'Failed to update user name' }, { status: 500 });
  }
}

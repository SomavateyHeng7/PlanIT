import connectDB from '@/lib/db';
import User from '@/models/user'; 
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Secret key for JWT (in production, store this in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(req) {
  await connectDB();

  // Get the Authorization header from the request
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];  // Extract the token part

  // Verify the JWT token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;  // The user ID is embedded in the token

    // Fetch the user from the database using the decoded user ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user profile
    const userProfile = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ profile: userProfile }, { status: 200 });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

import connectDB from '@/lib/db';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  // Validate input
  if (!email || !password) {
    return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400 });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
  }

  // Compare password
  const isMatch = await user.comparePassword(password); // using comparePassword method
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  // Return token
  return NextResponse.json({
    message: 'Login successful',
    token: token,  // Return the JWT token
  }, { status: 200 });
}

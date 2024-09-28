import connectDB from '@/lib/db';
import User from '@/models/user'; 
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
  }

  // Generate a JWT token (with a user ID or any other unique identifier)
  const token = jwt.sign(
    { id: user._id, email: user.email },  // Payload
    JWT_SECRET,                          // Secret key
    { expiresIn: '1h' }                  // Token expiration time
  );

  // Return token to the client (no need to store it in cookies server-side)
  return NextResponse.json({
    message: 'Login successful',
    token: token,  // Return the JWT token
  }, { status: 200 });
}

import connectDB from '@/lib/db';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Set JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Function to handle the POST request
export async function POST(req) {
  await connectDB();

  const { name, email, password, confirmPassword } = await req.json();

  // Validate input fields
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Create a new user
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    // Set the token in the HTTP-only cookie
    const response = NextResponse.json({ message: 'User created successfully' });
    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict;`
    );
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}

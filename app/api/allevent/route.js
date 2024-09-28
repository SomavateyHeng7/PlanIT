// app/api/events/route.js
import connectDB from '@/lib/db';
import Event from '@/models/event';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  try {
    const events = await Event.find({});
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

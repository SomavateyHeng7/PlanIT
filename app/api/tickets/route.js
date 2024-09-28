import connectDB from '@/lib/db';  // Ensure DB is connected
import TicketPurchase from '@/models/ticket';  // Import TicketPurchase model
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();  // Ensure the database is connected

  try {
    // Retrieve all tickets and populate event details
    const tickets = await TicketPurchase.find().populate({
      path: 'eventId',
      select: 'eventTitle date startTime endTime location description',
    });

    if (!tickets || tickets.length === 0) {
      return NextResponse.json({ message: 'No tickets found' }, { status: 404 });
    }

    // Return the list of tickets with populated event details
    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving tickets:', error);
    return NextResponse.json({ error: 'Failed to retrieve tickets' }, { status: 500 });
  }
}

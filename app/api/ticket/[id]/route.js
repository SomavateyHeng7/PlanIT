import connectDB from '@/lib/db';  // Ensure DB is connected
import TicketPurchase from '@/models/ticket';  // Import TicketPurchase model
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  await connectDB();  // Ensure the database is connected

  const { id } = params;  // Extract the ticket ID from the URL
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
  }

  try {
    // Find the ticket by ID and populate the event details
    const ticket = await TicketPurchase.findById(id).populate({
      path: 'eventId',
      select: 'eventTitle date startTime endTime location description',
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Return the ticket with the populated event details
    return NextResponse.json({ ticket }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving ticket details:', error);
    return NextResponse.json({ error: 'Failed to retrieve ticket details' }, { status: 500 });
  }
}

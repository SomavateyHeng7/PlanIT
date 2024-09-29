import connectDB from '@/lib/db';
import Event from '@/models/event';

export async function GET(req) {
  await connectDB();  // Ensure database connection

  try {
    // Fetch all events
    const events = await Event.find({});

    // Set no-store Cache-Control to prevent caching of API response
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

    return new Response(JSON.stringify(events), {
      status: 200,
      headers
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), { status: 500 });
  }
}

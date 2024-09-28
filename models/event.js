import mongoose from 'mongoose';

// Define the event schema
const eventSchema = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
  },
  location: {
    type: String,
    required: function() {
      return this.eventType === 'Venue'; // Location is required only if the event is in a venue
    },
    trim: true,
  },
  price: {
    type: Number,
    default: 0, // If the event is free, price is set to 0
    required: [true, 'Price is required'],
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [0, 'Capacity must be at least 0'],
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  eventType: {
    type: String,
    enum: ['Venue', 'Online', 'TBA'],  // Event can be either Venue, Online, or To Be Announced (TBA)
    default: 'Venue',
  },
  image: {
    type: String,  // Path to the image file (optional)
  },
  description: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the user who created the event
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set to the current date when the event is created
  },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Create the Event model from the schema
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;

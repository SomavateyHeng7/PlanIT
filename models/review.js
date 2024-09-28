import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the Event
    required: true,
    ref: 'Event',  // Assuming you have an Event model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the User who created the review
    ref: 'User',  // Assuming you have a User model
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set to current date when the review is created
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Automatically set to current date when the review is updated
  },
});

// Middleware to update the `updatedAt` field on save
reviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Review model from the schema
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;

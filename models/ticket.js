import mongoose from 'mongoose';

// Define the ticket purchase schema
const ticketPurchaseSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the event
    required: true,
    ref: 'Event',  // Assuming you have an Event model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the user
    required: true,
    ref: 'User',  // Assuming you have a User model
  },
  ticketCount: {
    type: Number,
    required: true,
    default: 1,  // Number of tickets purchased
  },
  pricePerTicket: {
    type: Number,
    required: true,  // The price of a single ticket
  },
  totalPrice: {
    type: Number,
    required: true,  // Total price for the ticketCount
  },
  paymentDetails: {
    cardNumber: {
      type: String,
      required: true,
      trim: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
  },
  purchaseDate: {
    type: Date,
    default: Date.now,  // Automatically records when the purchase was made
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],  // Payment status
    default: 'pending',
  },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Middleware to automatically calculate total price before saving
ticketPurchaseSchema.pre('save', function (next) {
  this.totalPrice = this.ticketCount * this.pricePerTicket;
  next();
});

// Create the TicketPurchase model from the schema
const TicketPurchase = mongoose.models.TicketPurchase || mongoose.model('TicketPurchase', ticketPurchaseSchema);

export default TicketPurchase;

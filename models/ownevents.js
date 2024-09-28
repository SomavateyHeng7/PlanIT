import mongoose from 'mongoose';

const ownEventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user who created the event
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const OwnEvent = mongoose.models.OwnEvent || mongoose.model('OwnEvent', ownEventSchema);
export default OwnEvent;

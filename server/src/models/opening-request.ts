import { Schema, model } from 'mongoose';



const OpeningRequestSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },

  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'accepted', 'rejected'],
    default: 'waiting',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    default: ''
  }
}, {
  id: false
});

export const OpeningRequest = model('OpeningRequest', OpeningRequestSchema);

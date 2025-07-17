import { Schema, model } from 'mongoose';



const RequestSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  start: {
    type: Number,
    required: true
  },
  end: {
    type: Number,
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
    enum: ['en attente', 'acceptée', 'refusée'],
    default: 'en attente',
    required: true
  },
  message: {
    type: String,
    default: '',
    required: true
  },
  response: {
    type: String,
    default: ''
  }
}, {
  id: false
});

export const Request = model('Request', RequestSchema);

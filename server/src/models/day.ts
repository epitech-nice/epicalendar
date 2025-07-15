import { Schema, model } from 'mongoose';



const DaySchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  start: {
    type: Number,
    required: true
  },
  end: {
    type: Number,
    required: true
  },

  aer: [{
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  }],
  observations: {
    type: String,
    default: ''
  },
}, {
  id: false
});

export const Day = model('Day', DaySchema);

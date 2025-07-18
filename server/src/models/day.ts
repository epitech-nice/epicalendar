import { Schema, model } from 'mongoose';



const DaySchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  start: { // Moment (hours:minutes) when the campus opens [ex: '08:00']
    type: String,
    required: true
  },
  start_at: { // Moment (hours:minutes) when the guard starts [ex: '18:00']
    type: String,
    required: true
  },
  end: { // Moment (hours:minutes) when the campus closes [ex: '22:00']
    type: String,
    required: true
  },
  closed_at: { // Moment (hours:minutes) when the AER closes the campus [ex: '20:00']
    type: String,
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

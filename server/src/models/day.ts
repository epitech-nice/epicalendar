import { Schema, model } from 'mongoose';



const DaySchema = new Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    open: { // Moment (hours:minutes) when the campus opens [ex: '08:00']
        type: Date,
        required: true
    },
    start: { // Moment (hours:minutes) when the guard starts [ex: '18:00']
        type: Date,
        required: true
    },
    close: { // Moment (hours:minutes) when the campus closes [ex: '22:00']
        type: Date,
        required: true
    },
    end: { // Moment (hours:minutes) when the guard end (AER closes the campus) [ex: '20:00']
        type: Date,
    },

    aers: [{
        type: Schema.Types.ObjectId,
        ref: 'Account',
    }],
    message: {
        type: String,
        default: ''
    },
    observations: {
        type: String,
        default: ''
    },
}, {
    id: false
});

export const Day = model('Day', DaySchema);

import {Schema, model, Types} from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const AccountSchema = new Schema({
  // Connection information
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },

  // Personal information
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'aer', 'admin'],
    default: 'student',
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    default: '/default-user.jpg'
  },
  guard_time: {
    type: Number,
    default: 0,
  },

  // Preferences
  day: {
    type: String,
    enum: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: '',
  },
  room: {
    type: String,
    default: '',
  }
}, {
  id: false
});

export const Account = model('Account', AccountSchema);

export async function formatAccountFields(first_name: string | null, last_name: string, password: string): Promise<{ first_name: string | null, last_name: string | null, password: string | null }> {
  const formattedFirstName = !first_name ? null :
      first_name
      .split(/[-\s]/)
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(first_name.includes('-') ? '-' : ' ');
  const formattedLastName = !first_name ? null :
      last_name.toUpperCase();
  const formattedPassword = !first_name ? null :
      await bcrypt.hash(password, 10);

  return {
    first_name: formattedFirstName,
    last_name: formattedLastName,
    password: formattedPassword
  };
}

export function generateToken(id: Types.ObjectId, role: string): string {
  return jwt.sign(
    { id: id, role: role },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' });
}

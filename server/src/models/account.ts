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
    enum: ['étudiant', 'aer', 'admin'],
    default: 'étudiant',
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

  // Preferences
  day: {
    type: String,
    enum: ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
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

export async function formatAccountFields(first_name: string, last_name: string, password: string): Promise<{ first_name: string, last_name: string, password: string }> {
  const formattedFirstName = first_name
      .split(/[-\s]/)
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(first_name.includes('-') ? '-' : ' ');
  const formattedLastName = last_name.toUpperCase();
  const formattedPassword = await bcrypt.hash(password, 10);

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

import mongoose, { Schema, Document } from 'mongoose';

// export interface Message extends Document {
//   content: string;
//   createdAt: Date;
// }

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// export interface User extends Document {
//   username: string;
//   email: string;
//   password: string;
//   verifyCode: string;
//   verifyCodeExpiry: Date; 
//   isVerified: boolean;
//   isAcceptingMessages: boolean;
//   messages: Message[];
// }

// Updated User schema
const ContactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'phone number is required'],
  },
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  messages: [MessageSchema],
});

const ContactModel =
  (mongoose.models.Contact) ||
  mongoose.model('Contact', ContactSchema);

export default ContactModel;
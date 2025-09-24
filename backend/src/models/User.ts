import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    chatId: string;
    isEnabled: boolean;
    frequency: number; // in minutes
    lastSentAt: Date | null;
}

const UserSchema: Schema = new Schema({
    chatId: { type: String, required: true, unique: true },
    isEnabled: { type: Boolean, default: true },
    frequency: { type: Number, default: 1 },
    lastSentAt: { type: Date, default: null }
});

export const User = mongoose.model<IUser>('User', UserSchema);

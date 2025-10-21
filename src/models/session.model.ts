import mongoose, { Document } from 'mongoose';
import { IUserDocument } from "../models/user.model";

export interface ISession{
    user: mongoose.Types.ObjectId; //IUserDocument["_id"]
    valid: boolean;
    userAgent:string;
    expiresAt:Date
}

export interface ISessionDocument extends ISession, Document{
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new mongoose.Schema<ISessionDocument>({
    user: { type: mongoose.Schema.Types.ObjectId , ref: 'User'},
    valid: { type: Boolean, default:true },
    userAgent: { type: String },
    expiresAt: { type: Date, required: true }
}, { timestamps: true })

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model<ISessionDocument>("Session", sessionSchema);
export default Session;
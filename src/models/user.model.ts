import mongoose, { Document, Types } from 'mongoose';
import bcrypt from "bcrypt";
import config from 'config';

export interface IUser {
    email: string,
    name: string,
    password: string,
    role?: string,
    isVerified?:boolean

}

export interface IUserDocument extends IUser, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date,
    updatedAt: Date,
    comparePassword(inputPassword: string): Promise<boolean>
}


const userSchema = new mongoose.Schema<IUserDocument>({
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isVerified: {
        type:Boolean,
        default: false
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    let user = this as IUserDocument;
    if (!user.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
    user.password = await bcrypt.hash(user.password, salt);
    next();
})

userSchema.methods.comparePassword = async function (inputPassword: string): Promise<boolean> {
    const user = this as IUserDocument;
    return bcrypt.compare(inputPassword, user.password).catch((e) => false);
}

const User = mongoose.model<IUserDocument>("User", userSchema);
export default User;
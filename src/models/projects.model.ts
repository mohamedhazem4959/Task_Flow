import mongoose, { Document, mongo, Types } from "mongoose";

export interface IProjectMember{
    user: Types.ObjectId;
    role: 'admin' | 'member';
}

export interface IProject extends Document {
    name:string;
    description?:string;
    members: IProjectMember[];
    tasks: Types.ObjectId[];
    createdBy: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const projectSchema = new mongoose.Schema<IProject>({
    name:{
        type:String,
        required: true,
        unique: true
    },
    description: String,
    members:[{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'member'], default: 'member' }
    }],
    tasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks'
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


const Project = mongoose.model<IProject>('Project', projectSchema);
export default Project;
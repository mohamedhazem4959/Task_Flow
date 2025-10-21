import mongoose, { Document } from "mongoose";

export interface ITask extends Document{
    title: string;
    status: 'completed' | 'working' | 'pending';
    description?:string;
    user: mongoose.Schema.Types.ObjectId;
    member: mongoose.Schema.Types.ObjectId;
    project: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>({
    title:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ['completed','working','pending'],
        default: 'pending'
    },
    description: String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    member:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index:true
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }
}, { timestamps: true })

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;
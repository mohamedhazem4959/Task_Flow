import mongoose, { FilterQuery } from "mongoose";
import Task, { ITask } from "../models/tasks.model";
import logger from "../utils/logger";
import Project from "../models/projects.model";


export const createTask = async(title:string, userId:string,status?:string,description?:string,project?:string, member?:mongoose.Types.ObjectId)=>{
    const task = await Task.create({title: title, status:status, description:description, project:project,user:userId, member:member});
    if (project) {
        logger.info("found project");
        await Project.findByIdAndUpdate(project, { $push: {tasks: task._id} }, { new: true });
    }
    return task;
}

export const getTask = async (query: FilterQuery<ITask>) => {
    return Task.find(query).lean();
}

export const updateAdminTask = async (taskId:string, userId:string, title?:string, status?:string, description?:string, member?:mongoose.Types.ObjectId) => {
    const task = await Task.findOneAndUpdate({ _id:taskId, user:userId }, {title:title, status:status, description:description, member:member});
    logger.info(task);
    if (!task) {
        logger.error("task not found");
        return;
    }
    return task;
}

export const updateStatusTask = async (status:string, member:string, project:string) => {
    const task = await Task.findOneAndUpdate({member:member, project:project}, {status: status});
    logger.info(task);
    if (!task) {
        logger.error("Task of that member does not found");
        return;
    }
    return task;
}

export const deleteTask = async (userId:string,taskId:string) => {
    const task = await Task.findOneAndDelete({user:userId, _id:taskId});
    logger.info(task);
    if (!task) {
        logger.error("Task not found");
    }
    return task
}
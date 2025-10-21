import { Response } from "express";
import { io } from "../app";
import { createTask, getTask, updateAdminTask, updateStatusTask, deleteTask } from '../services/tasks.service'
import { AuthRequset } from "../types/request.types";
import logger from "../utils/logger";
import { getSingleTaskValidation } from "../schema/tasks.schema";
import { getMemberByEmail } from "../services/project.service";
import mongoose, { mongo } from "mongoose";
import { notifyAddMemberToTask, transporter } from "../utils/sendMail";

export const createTaskHandler = async (req: AuthRequset, res: Response) => {
    try {
        const { title, status, description, projectId, memberEmail } = req.body;
        const userId = req.user!._id;
        let memberId: mongoose.Types.ObjectId | undefined;
        let memberName: string | undefined;
        if (memberEmail) {
            const member = await getMemberByEmail(projectId, memberEmail);
            if (!member) {
                return res.status(404).json({
                    success: false,
                    msg: 'Member not found in this project'
                });
            }
            memberId = member._id;
            memberName = member.name;
        }
        const task = await createTask(title, userId, status, description, projectId, memberId);
        const taskAndProject = await task.populate("project")
        if(memberEmail){
            const html = notifyAddMemberToTask(memberName, task.title)
            transporter.sendMail({
                from: req.user!.email,
                to: memberEmail,
                subject: "assign member to task",
                html
            })
        }
        if (projectId) io.to(projectId).emit("taskCreated", task);
        return res.status(201).json({
            success: true,
            msg: 'task created successfully',
            data: taskAndProject
        })
    } catch (error: any) {
        logger.error("error while creating task", error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const getTasksHandler = async (req: AuthRequset, res: Response) => {
    try {
        const tasks = await getTask({});
        if (!tasks) {
            logger.warn("to tasks is found", tasks);
            return res.status(404).json({ success: false, msg: 'No Tasks Found' });
        }
        return res.status(200).json({ success: true, data: tasks });
    } catch (error: any) {
        logger.error("Error while getting tasks", error.message);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const getSingleTaskHandler = async (req: AuthRequset, res: Response) => {
    try {
        const { params: { taskId } } = getSingleTaskValidation.parse(req)
        logger.warn(taskId)
        const task = await getTask({ _id: taskId });
        if (!task) {
            logger.error("task not found");
            return res.status(404).json({ success: false, msg: 'task not found' })
        }
        return res.status(200).json({ success: true, data: task });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message })
    }
}

export const updateTaskAdminHandler = async (req: AuthRequset, res: Response) => {
    try {
        const { title, status, description, projectId, memberEmail } = req.body;
        logger.info(title, status, description, memberEmail);
        const { params: { taskId } } = getSingleTaskValidation.parse(req);
        const userId = req.user!._id;
        if (memberEmail) {
            const member = await getMemberByEmail(projectId, memberEmail);
        }
        const newTask = await updateAdminTask(taskId, userId, title, status, description, memberEmail);
        if (projectId) io.to(projectId).emit("taskUpdated", newTask)
        return res.status(200).json({
            success: true,
            msg: 'task updated successfully',
            data: newTask
        })
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message })
    }
}

export const updateTaskStatusHandler = async (req: AuthRequset, res: Response) => {
    try {
        const { status, projectId } = req.body;
        const memberId = req.user!._id;
        const isUserMember = await getTask({ member: memberId });
        if (!isUserMember) {
            return res.status(403).json({ success: false, msg: "Access denied" });
        }
        const task = await updateStatusTask(status, memberId, projectId);
        if (projectId) io.to(projectId).emit("taskUpdated", task);
        return res.status(200).json({ success: true, msg: "task status updated successfullt", data: task });

    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const deleteTaskHandler = async (req: AuthRequset, res: Response) => {
    try {
        const userId = req.user!._id;
        const { params: { taskId } } = getSingleTaskValidation.parse(req);
        const task = await deleteTask(userId, taskId);
        if (!task) return res.status(404).json({ success: false, msg: "task not found to delete" });
        return res.status(200).json({ success: true, msg: "task deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}

// if (project) {
//     const projectDoc = await Project.findById(project);
//     if (!projectDoc) {
//         logger.error("project not found")
//         return res.status(404).json({error:'project not found'});
//     }
//     const isAdmin = projectDoc.members.some(
//         (member) => member.user.toString() === userId.toString() && member.role === "admin"
//     )
//     if (!isAdmin) {
//         logger.error("User is NOT an admin in this project");
//         return res.status(403).json({error:"Access denied"});
//     }
//     logger.info("User is an admin to this project");
// }
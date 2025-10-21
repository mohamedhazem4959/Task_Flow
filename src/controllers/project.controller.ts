import { AuthRequset } from "../types/request.types";
import { Response } from "express";
import { addMember, createProject, updateProject } from "../services/project.service";
import { getSingleProjectValidation } from "../schema/project.schema";
import logger from "../utils/logger";
import { transporter, notifyAddMemberToProject } from "../utils/sendMail";
import config from 'config'

export const createProjectHandler = async (req: AuthRequset, res: Response) => {
    try {
        const { name, description } = req.body;
        const createdBy = req.user!._id;
        const newProject = await createProject(name, createdBy, description);
        if (!newProject) {
            return res.status(404).json({ success: false, msg: "Project Not Created" });
        }
        return res.status(200).json({ success: true, msg: "Project created successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, err: error.message })
    }
}

export const updateProjectHandler = async (req: AuthRequset, res: Response) => {
    try {
        const { name, description } = req.body;
        logger.info(req.params)
        const { params: { projectId } } = getSingleProjectValidation.parse(req);
        const user = req.user!._id;
        const newProject = await updateProject(projectId, user, name, description);
        if (!newProject) {
            return res.status(404).json({ success: false, msg: "Project Not Found" });
        }
        return res.status(200).json({ success: true, msg: "project updated successfully" })
    } catch (error: any) {
        return res.status(500).json({ success: false, err: error.message })
    }
}

export const addMemberHandler = async (req: AuthRequset, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(403).send("Access denied!");
        }
        const { email } = req.body;
        const { params: { projectId } } = getSingleProjectValidation.parse(req);
        const member = await addMember(projectId, email);
        if (!member) {
            return res.status(404).json({ success: false, msg: "project or user not found" });
        }
        const html = notifyAddMemberToProject(member.user?.name, member.project?.name)
        transporter.sendMail({
            from: user.email,
            to: req.body.email,
            subject: "Add member to project",
            html
        })
        return res.status(200).json({ success: true, msg: "new member has been added successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, err: error.message })
    }
}
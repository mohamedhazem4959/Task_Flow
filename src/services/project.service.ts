import Project from "../models/projects.model";
import logger from "../utils/logger";
import User from "../models/user.model";
import mongoose from "mongoose";

export const getMemberByEmail = async (projectId: string, email: string) => {

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        logger.warn("project id is not valid");
        return null;
    }

    const user = await User.findOne({ email });
    if (!user) return null;
    logger.info(user);

    const project = await Project.findOne({
        _id: projectId,
        "members.user": user._id,
    }, { "members.$": 1 })
    if (!project) return null;

    const member = project.members[0];
    return {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: member.role
    };
}

export const createProject = async (name: string, createdBy: mongoose.Types.ObjectId, description?: string) => {
    const project = await Project.create({ name: name, description: description, createdBy: createdBy, members: [{ user: createdBy, role: 'admin' }] });
    return project;
}

export const updateProject = async (projectId: string, user: string, name?: string, description?: string) => {
    const project = await Project.findOneAndUpdate({ createdBy: user, _id: projectId }, { name: name, description: description });
    return project;
}

export const addMember = async (projectId: string, email: string) => {
    logger.info("inside the add member")
    const user = await User.findOne({ email });
    if (!user) {
        logger.error("can not find user", user);
        throw new Error("User not found");
    }
    logger.info("found the user")
    const project = await Project.findByIdAndUpdate(projectId,
        { $addToSet: { members: { user: user._id } } },
        { new: true }
    ).populate("members.user", "name email");

    if (!project) {
        throw new Error("Project not found");
    }

    logger.info(`Added ${user.email} to project ${project.name}`);

    return { user, project };
}
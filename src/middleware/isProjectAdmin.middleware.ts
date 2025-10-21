import { Response, NextFunction } from "express";
import Project from "../models/projects.model";
import logger from "../utils/logger";
import { AuthRequset } from "../types/request.types";
import { getSingleProjectValidation } from "../schema/project.schema";
export const isProjectAdmin = async (req: AuthRequset, res: Response, next: NextFunction) => {
  try {
    let projectId: string | undefined;
    if (req.params?.projectId) {
      const { params } = getSingleProjectValidation.parse(req);
      projectId = params.projectId;
    } else if (req.body?.projectId) {
      projectId = req.body.projectId;
    }
    if (!projectId) {
      logger.info("No project provided — skipping admin check (solo user)");
      return next();
    }
    const userId = req.user!._id;

    const projectDoc = await Project.findById(projectId);
    if (!projectDoc) {
      logger.error("Project not found");
      return res.status(404).json({ error: "Project not found" });
    }

    const isAdmin = projectDoc.members.some(
      (member) => member.user.toString() === userId.toString() && member.role === "admin"
    );

    if (!isAdmin) {
      logger.error("User is NOT an admin in this project");
      return res.status(403).json({ error: "Access denied" });
    }

    logger.info("User is an admin for this project");
    next();
  } catch (err: any) {
    logger.error("Error in isProjectAdmin middleware", err);
    return res.status(500).json({ error: "Server error", message: err.message });
  }
};

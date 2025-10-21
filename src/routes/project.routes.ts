import express, { Router } from "express";
import { authenticate } from "../middleware/authentication.middleware";
import validate from "../middleware/validateResource";
import { addMemberValidation, createProjectValidation, getSingleProjectValidation, updateProjectValidation } from "../schema/project.schema";
import { addMemberHandler, createProjectHandler, updateProjectHandler } from "../controllers/project.controller";
import { isProjectAdmin } from "../middleware/isProjectAdmin.middleware";

const router:Router = express.Router();

router.post('/addProject',
authenticate,
validate(createProjectValidation),
createProjectHandler);

router.put('/updateProject/:projectId',
authenticate,
validate(getSingleProjectValidation),
validate(updateProjectValidation),
isProjectAdmin,
updateProjectHandler)

router.put('/addMember/:projectId',
authenticate,
validate(getSingleProjectValidation),
validate(addMemberValidation),
isProjectAdmin,
addMemberHandler
)
export default router;
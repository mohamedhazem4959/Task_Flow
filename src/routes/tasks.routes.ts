import express,{ Router } from "express";
import { authenticate } from "../middleware/authentication.middleware";
import { authorize } from "../middleware/role.middleware";
import validate from "../middleware/validateResource";
import {createTask, getSingleTaskValidation, updateAdminTask} from "../schema/tasks.schema";
import { createTaskHandler, getSingleTaskHandler, getTasksHandler, updateTaskAdminHandler } from "../controllers/tasks.controller";
import { isProjectAdmin } from "../middleware/isProjectAdmin.middleware";
const router:Router = express.Router();

router.post('/add-task',authenticate,validate(createTask), createTaskHandler);

router.get('/get-tasks', authenticate, getTasksHandler)

router.get('/single-task/:taskId',authenticate,validate(getSingleTaskValidation),getSingleTaskHandler)

router.put('/update-admin-task/:taskId', authenticate, validate(getSingleTaskValidation),validate(updateAdminTask),isProjectAdmin, updateTaskAdminHandler);


export default router;
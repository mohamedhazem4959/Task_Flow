import express from 'express';
import { createAdminHandler, createUserHandler, verifyEmail } from "../controllers/user.controller";
import {createSessionHandler, deleteSessionHandler, getUserSessionHandler} from '../controllers/session.controller'
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";
import { createSessionSchema } from '../schema/session.schema';
import { authenticate } from '../middleware/authentication.middleware';

const router = express.Router();

//to create new user (register)
router.post('/users', validateResource(createUserSchema), createUserHandler);

router.get("/verify", verifyEmail)

//login and create a new valid session
router.post('/sessions',validateResource(createSessionSchema), createSessionHandler);

//to get the valid session
router.get('/getSessions',authenticate, getUserSessionHandler);

// to update the value of valid to false (soft delete)
router.put('/deleteSession', authenticate, deleteSessionHandler);

//to create an admin
router.post('/admin/users',validateResource(createUserSchema), createAdminHandler('admin'));

export default router;
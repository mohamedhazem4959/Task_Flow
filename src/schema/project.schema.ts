import * as z from "zod";
import mongoose from "mongoose";
import { describe } from "node:test";
import logger from "../utils/logger";

export const getSingleProjectValidation = z.object({
    params: z.object({
        projectId: z.string()
        .refine((id)=> mongoose.Types.ObjectId.isValid(id),{
            message: "Invalid task ID format"
        })
    })
})

export const createProjectValidation = z.object({
    body: z.object({
        name: z.string(),
        description: z.string()
    })
})
export const updateProjectValidation = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional()
    })
})
export const addMemberValidation = z.object({
    body: z.object({
        email: z
            .string('Email is required')
            .email({error: 'Invalid email address'})
    })
})